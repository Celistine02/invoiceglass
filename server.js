const express = require("express");
const os = require("os");
const cluster = require("cluster");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const dbConnect = require("./config/dbConnect");
const errorHandler = require("./src/middleware/errorHandler");
const initializeMiddleware = require("./src/middleware/initializeMiddleware");
const checkSmtpConnection = require("./src/middleware/smtpCheck");

const localDeviceRoutes = require("./src/routes/localDeviceRoutes");
const authRoutes = require("./src/routes/authRoutes");
const createInvoiceRoutes = require("./src/routes/invoiceRoutes");

const PORT = process.env.PORT || 5001;
const app = express();

// Initialize middleware
initializeMiddleware(app);
checkSmtpConnection(app);

// Use JSON middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);

  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} exited. Restarting...`);
    cluster.fork();
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Closing workers...");
    for (const id in cluster.workers) {
      cluster.workers[id].kill();
    }
  });
} else {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "default-secret-key",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URl, // Corrected to use MONGO_URl from .env
        ttl: 14 * 24 * 60 * 60,
      }),
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "strict",
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  dbConnect()
    .then(() => {
      console.log("Database connected successfully");

      app.use("/invoiceglass/local", localDeviceRoutes);
      app.use("/invoiceglass/auth", authRoutes);
      app.use("/invoiceglass/invoices", createInvoiceRoutes);

      app.use(errorHandler);

      const server = app.listen(PORT, () => {
        const ip = Object.values(os.networkInterfaces())
          .flat()
          .find(
            (details) => details.family === "IPv4" && !details.internal
          )?.address;

        console.log(`Glass Aluminium Center Invoices running on port: ${PORT}`);
        console.log(`Server IP: ${ip}`);
      });

      process.on("SIGTERM", () => {
        console.log("SIGTERM received: closing server...");
        server.close(() => console.log("Server closed."));
      });

      let trafficCount = 0;
      app.use((req, res, next) => {
        trafficCount++;
        console.log(
          `Request: ${req.method} ${req.path}. Total: ${trafficCount}`
        );
        next();
      });

      app.get("/", (req, res) => {
        res.send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Glass Aluminium Center Invoices</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; text-align: center; margin-top: 100px; color: #333; }
              h1 { font-size: 3em; color: #007bff; margin-bottom: 20px; animation: fadeInDown 1s ease; }
              p { font-size: 1.2em; color: #666; animation: fadeInUp 1s ease; }
              .developer-info { position: fixed; bottom: 10px; right: 10px; font-size: 0.8em; color: #888; }
              @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
              @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            </style>
          </head>
          <body>
            <h1>Welcome to Glass Aluminium Center Invoices!</h1>
            <p>For inquiries, contact us below:</p>
            <div class="developer-info">
              <p>Developed by Celistine Chipangura</p>    
              <p>Github: <a href="https://github.com/Celistine02">Celistine Chipangura</a></p>
              <p>Phone: +263712543689</p>
            </div>
          </body>
          </html>
        `);
      });
    })
    .catch((error) => {
      console.error(`Database connection failed: ${error.message}`);
      process.exit(1);
    });
}
