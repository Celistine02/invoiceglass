// Import required modules
const express = require("express");
const os = require("os");
const cluster = require("cluster");
const passport = require("passport");
const session = require("express-session");
const dbConnect = require("./config/dbConnect");
const errorHandler = require("./src/middleware/errorHandler");
const initializeMiddleware = require("./src/middleware/initializeMiddleware");
const checkSmtpConnection = require("./src/middleware/smtpCheck");

const localDeviceRoutes = require("./src/routes/localDeviceRoutes"); // Import local device routes
const authRoutes = require("./src/routes/authRoutes"); // Import auth routes
const createInvoiceRoutes = require("./src/routes/invoiceRoutes"); // Import create invoice routes

// Configuration: Retrieve port from environment variables or set default to 5001
const PORT = process.env.PORT || 5001;
const app = express();

// Initialize middleware
initializeMiddleware(app);
checkSmtpConnection(app);

// Cluster setup for load balancing
if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);

  // Fork workers for load balancing
  for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} exited. Starting a new worker.`);
    cluster.fork();
  });

  // Handle graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    for (const id in cluster.workers) {
      cluster.workers[id].kill();
    }
  });
} else {
  // Configure session management with enhanced security
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "default-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "strict",
      },
    })
  );

  // Initialize Passport for authentication
  app.use(passport.initialize());
  app.use(passport.session());

  // Connect to the database before starting the server
  dbConnect()
    .then(() => {
      // Start the Express server
      const server = app.listen(PORT, () => {
        const ip = Object.values(os.networkInterfaces())
          .flat()
          .find(
            (details) => details.family === "IPv4" && !details.internal
          ).address;

        console.log(`Glass Aluminium Center Invoices listening on port: ${PORT}`);
        console.log(`Server running on IP: ${ip}`);
      });

      // Define a simple GET route for the root path
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
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f4f4f4;
              text-align: center;
              margin-top: 100px;
              color: #333;
            }
            h1 {
              font-size: 3em;
              color: #007bff;
              margin-bottom: 20px;
              animation: fadeInDown 1s ease;
            }
            p {
              font-size: 1.2em;
              color: #666;
              animation: fadeInUp 1s ease;
            }
            .developer-info {
              position: fixed;
              bottom: 10px;
              right: 10px;
              font-size: 0.8em;
              color: #888;
            }
            @keyframes fadeInDown {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          </style>
        </head>
        <body>
          <img src="" alt="" style="width: 100px; height: auto; margin-bottom: 20px;">
          <h1>Welcome to the Glass Aluminium Center Invoices!</h1>
          <p>We collect a large amount of data from our customers with their consent. For inquiries, contact us below:</p>
          <div class="developer-info">
            <p>Developed by Celistine Chipangura</p>    
            <p>Github: <a href="https://github.com/Celistine02">Celistine Chipangura</a></p>
            <p>Phone: +263712543689</p>
          </div>
        </body>
        </html>     
        `);
      });

      // Add routes for mobile services
      
      app.use("/invoiceglass/local", localDeviceRoutes); // Use local device routes
      app.use("/invoiceglass/auth", authRoutes); // Use auth routes
      app.use("/invoiceglass/invoices", createInvoiceRoutes); // Use create invoice routes

      // Error handling middleware
      app.use(errorHandler);

      console.log(`Worker process ${process.pid} started`);

      // Handle graceful shutdown
      process.on("SIGTERM", () => {
        console.log("SIGTERM signal received: closing HTTP server");
        server.close(() => {
          console.log("HTTP server closed");
        });
      });

      // Middleware to log traffic
      let trafficCount = 0;
      app.use((req, res, next) => {
        trafficCount++;
        console.log(
          `Request received: ${req.method} ${req.path}. Total traffic: ${trafficCount}`
        );
        next();
      });
    })
    .catch((error) => {
      console.error(`Failed to connect to the database: ${error.message}`);
      process.exit(1);
    });
}
