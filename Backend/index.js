const pool = require('../backend/config/database');
const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const { registerUser, loginUser } = require('./controllers/authController');
const ErrorMiddleware = require("../backend/middlewares/error");
const dotenv =require("dotenv");
const app = express();
const path =require("path");
const cookieParser = require('cookie-parser');
const { query } = require('mysql2/promise');

const { isAuthenticatedUser, authorizeRoles } = require('../backend/middlewares/authenticate');

dotenv.config({path : path.join(__dirname,"config","config.env")});

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true, // Allow requests with credentials
  };
  
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define route handlers
app.get("/", (req, res) => {
    res.send("Hello from Express!");
});

// Authentication route with the correct path
app.post('/api/register', registerUser);
app.post('/api/login', loginUser);






app.get('/api/userRole', isAuthenticatedUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const sqlQuery = 'SELECT role FROM users WHERE id = ?'; // Adjust table name if necessary
        const [result] = await pool.query(sqlQuery, [userId]);
        if (!result || result.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Send the user role in the response
        res.status(200).json({ success: true, role: result[0].role });
    } catch (error) {
        console.error('Error fetching user role:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.get('/api/userdetail', isAuthenticatedUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const sqlQuery = 'SELECT * FROM users WHERE id = ?'; // Adjust table name if necessary
        const [result] = await pool.query(sqlQuery, [userId]);
        if (!result || result.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        // Send the user details in the response
        res.status(200).json({ success: true, userDetails: result[0] });
    } catch (error) {
        console.error('Error fetching user detail:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});




// farmers


app.get('/api/farmers', async (req, res) => {
    const sqlGet = "SELECT * FROM farmer";
    try {
        const [result] = await pool.query(sqlGet);
        res.send(result);
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Route for fetching a single farmer with related details
app.get("/api/farmers/:id", async (req, res) => {
    const { id } = req.params;

    // SQL query to fetch farmer details along with related data
    const sqlGetFarmer = `
        SELECT 
            f.*, 
            l.*, 
            fd.*, 
            cg.*, 
            ls.*, 
            fa.*
        FROM 
            farmer f
        LEFT JOIN 
            Location l ON f.farmerID = l.farmerID
        LEFT JOIN 
            FarmDescription fd ON f.farmerID = fd.farmerID
        LEFT JOIN 
            CropsGrown cg ON f.farmerID = cg.farmerID
        LEFT JOIN 
            Livestock ls ON f.farmerID = ls.farmerID
        LEFT JOIN 
            FarmingAssets fa ON f.farmerID = fa.farmerID
        WHERE 
            f.farmerID = ?`;

    try {
        const [result] = await pool.query(sqlGetFarmer, [id]);

        if (result.length === 0) {
            res.status(404).send({ message: "Farmer not found" });
            return;
        }

        // Extract farmer details from the result
        const farmerDetails = {
            farmer: result[0],
            location: result.map(row => ({
                Province: row.Province,
                District: row.District,
                DSDivision: row.DSDivision,
                GNDivision: row.GNDivision,
                Village: row.Village,
                ASCDivision: row.ASCDivision,
                AIRange: row.AIRange
            })),
            farmDescription: {
                Extent: result[0].Extent,
                LandOwnership: result[0].LandOwnership,
                FenceType: result[0].FenceType,
                WaterSource: result[0].WaterSource
            },
            cropsGrown: result.map(row => ({
                CropName: row.CropName,
                Extent: row.Extent
            })),
            livestock: result.map(row => ({
                LivestockType: row.LivestockType,
                Quantity: row.Quantity
            })),
            farmingAssets: result.map(row => ({
                AssetName: row.AssetName,
                Quantity: row.Quantity
            }))
        };

        res.send(farmerDetails);
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route for adding a farmer
app.post("/api/farmers", async (req, res) => {
    const { 
        Name, 
        Gender, 
        Age, 
        FamilyMembersMan, 
        FamilyMembersWoman, 
        FamilyMembersChild, 
        MaxEducation, 
        FamilyLabourMan, 
        FamilyLabourWoman, 
        FamilyLabourChild, 
        Address, 
        PhoneNumber, 
        Email,
        Province,
        District,
        DSDivision,
        GNDivision,
        Village,
        ASCDivision,
        AIRange,
        Extent,
        LandOwnership,
        FenceType,
        WaterSource,
        cropsGrown,
        livestock,
        farmingAssets
    } = req.body;
    
    try {
        // Insert into farmer table
        const sqlInsertFarmer = `
            INSERT INTO farmer (
                Name, 
                Gender, 
                Age, 
                FamilyMembersMan, 
                FamilyMembersWoman, 
                FamilyMembersChild, 
                MaxEducation, 
                FamilyLabourMan, 
                FamilyLabourWoman, 
                FamilyLabourChild, 
                Address, 
                PhoneNumber, 
                Email
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [farmerResult] = await pool.query(sqlInsertFarmer, [
            Name, 
            Gender, 
            Age, 
            FamilyMembersMan || 0,
            FamilyMembersWoman || 0,
            FamilyMembersChild || 0,
            MaxEducation,
            FamilyLabourMan || 0,
            FamilyLabourWoman || 0,
            FamilyLabourChild || 0,
            Address, 
            PhoneNumber, 
            Email
        ]);
        
        const farmerID = farmerResult.insertId;
        
        // Insert into location table
        const sqlInsertLocation = `
            INSERT INTO Location (
                Province,
                District,
                DSDivision,
                GNDivision,
                Village,
                ASCDivision,
                AIRange,
                farmerID
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        await pool.query(sqlInsertLocation, [
            Province,
            District,
            DSDivision,
            GNDivision,
            Village,
            ASCDivision,
            AIRange,
            farmerID
        ]);

        // Insert into FarmDescription table
        const sqlInsertFarmDescription = `
            INSERT INTO FarmDescription (
                Extent,
                LandOwnership,
                FenceType,
                WaterSource,
                farmerID
            ) VALUES (?, ?, ?, ?, ?)`;
        
        await pool.query(sqlInsertFarmDescription, [
            Extent || 0,
            LandOwnership,
            FenceType,
            WaterSource,
            farmerID
        ]);

        // Insert into CropsGrown table
        console.log(cropsGrown);
        if (cropsGrown && cropsGrown.length > 0) {
            const sqlInsertCropsGrown = `
                INSERT INTO CropsGrown (
                    CropName,
                    Extent,
                    farmerID
                ) VALUES (?, ?, ?)`;
            
            for (const crop of cropsGrown) {
                await pool.query(sqlInsertCropsGrown, [
                    crop.CropName,
                    crop.Extent || 0,
                    farmerID
                ]);
            }
        }

        // Insert into Livestock table
        if (livestock && livestock.length > 0) {
            const sqlInsertLivestock = `
                INSERT INTO Livestock (
                    LivestockType,
                    Quantity,
                    farmerID
                ) VALUES (?, ?, ?)`;
            
            for (const livestock of livestock) {
                await pool.query(sqlInsertLivestock, [
                    livestock.LivestockType,
                    livestock.Quantity || 0,
                    farmerID
                ]);
            }
        }

        // Insert into FarmingAssets table
        if (farmingAssets && farmingAssets.length > 0) {
            const sqlInsertFarmingAssets = `
                INSERT INTO FarmingAssets (
                    AssetName,
                    Quantity,
                    farmerID
                ) VALUES (?, ?, ?)`;
            
            for (const asset of farmingAssets) {
                await pool.query(sqlInsertFarmingAssets, [
                    asset.AssetName,
                    asset.Quantity || 0,
                    farmerID
                ]);
            }
        }

        // Initialize RibbonCount table for the new farmer
        const sqlInsertRibbonCount = `
            INSERT INTO RibbonCount (
                farmerID, blue, red, yellow, white, purple, orange, black, pink
            ) VALUES (?, 0, 0, 0, 0, 0, 0, 0, 0)`;
        
        await pool.query(sqlInsertRibbonCount, [farmerID]);

        res.send({ message: "Farmer inserted successfully", insertedData: req.body });
    } catch (error) {
        console.error('Error inserting farmer:', error);
        res.status(500).send('Internal Server Error');
    }
});



// Route for updating a farmer
app.put("/api/farmers/:farmerId", async (req, res) => {
    const farmerId = req.params.farmerId;

    const { 
        Name, 
        Gender, 
        Age, 
        FamilyMembersMan, 
        FamilyMembersWoman, 
        FamilyMembersChild, 
        MaxEducation, 
        FamilyLabourMan, 
        FamilyLabourWoman, 
        FamilyLabourChild, 
        Address, 
        PhoneNumber, 
        Email,
        Province,
        District,
        DSDivision,
        GNDivision,
        Village,
        ASCDivision,
        AIRange,
        Extent,
        LandOwnership,
        FenceType,
        WaterSource,
        CropsGrown,
        Livestock,
        FarmingAssets
    } = req.body;

    try {
        // Update farmer details
        const sqlUpdateFarmer = `
            UPDATE farmer
            SET Name = ?, Gender = ?, Age = ?, FamilyMembersMan = ?, FamilyMembersWoman = ?, 
            FamilyMembersChild = ?, MaxEducation = ?, FamilyLabourMan = ?, FamilyLabourWoman = ?, 
            FamilyLabourChild = ?, Address = ?, PhoneNumber = ?, Email = ?
            WHERE farmerID = ?`;

        await pool.query(sqlUpdateFarmer, [
            Name, 
            Gender, 
            Age, 
            FamilyMembersMan || 0,
            FamilyMembersWoman || 0,
            FamilyMembersChild || 0,
            MaxEducation,
            FamilyLabourMan || 0,
            FamilyLabourWoman || 0,
            FamilyLabourChild || 0,
            Address, 
            PhoneNumber, 
            Email,
            farmerId
        ]);

        // Update location details
        const sqlUpdateLocation = `
            UPDATE Location
            SET Province = ?, District = ?, DSDivision = ?, GNDivision = ?, 
            Village = ?, ASCDivision = ?, AIRange = ?
            WHERE farmerID = ?`;

        await pool.query(sqlUpdateLocation, [
            Province,
            District,
            DSDivision,
            GNDivision,
            Village,
            ASCDivision,
            AIRange,
            farmerId
        ]);

        // Update farm description
        const sqlUpdateFarmDescription = `
            UPDATE FarmDescription
            SET Extent = ?, LandOwnership = ?, FenceType = ?, WaterSource = ?
            WHERE farmerID = ?`;

        await pool.query(sqlUpdateFarmDescription, [
            Extent || 0,
            LandOwnership,
            FenceType,
            WaterSource,
            farmerId
        ]);

        // Update crops grown
        // First, update existing crop records for this farmer
        if (CropsGrown && CropsGrown.length > 0) {
            const sqlUpdateCropsGrown = `
                UPDATE CropsGrown
                SET CropName = ?, Extent = ?
                WHERE farmerID = ? AND CropID = ?`;

            for (const crop of CropsGrown) {
                if (crop.CropID) { // Update existing crop
                    await pool.query(sqlUpdateCropsGrown, [
                        crop.CropName,
                        crop.Extent || 0,
                        farmerId,
                        crop.CropID // Assuming each crop has a unique identifier (CropID)
                    ]);
                } else { // Insert new crop
                    const sqlInsertCropsGrown = `
                        INSERT INTO CropsGrown (CropName, Extent, farmerID)
                        VALUES (?, ?, ?)`;
                    await pool.query(sqlInsertCropsGrown, [
                        crop.CropName,
                        crop.Extent || 0,
                        farmerId
                    ]);
                }
            }
        }

        // Update livestock
        if (Livestock && Livestock.length > 0) {
            const sqlUpdateLivestock = `
                UPDATE Livestock
                SET LivestockType = ?, Quantity = ?
                WHERE farmerID = ? AND LivestockID = ?`;

            for (const animal of Livestock) {
                if (animal.LivestockID) { // Update existing livestock
                    await pool.query(sqlUpdateLivestock, [
                        animal.LivestockType,
                        animal.Quantity || 0,
                        farmerId,
                        animal.LivestockID // Assuming each livestock has a unique identifier (LivestockID)
                    ]);
                } else { // Insert new livestock
                    const sqlInsertLivestock = `
                        INSERT INTO Livestock (LivestockType, Quantity, farmerID)
                        VALUES (?, ?, ?)`;
                    await pool.query(sqlInsertLivestock, [
                        animal.LivestockType,
                        animal.Quantity || 0,
                        farmerId
                    ]);
                }
            }
        }

        // Update farming assets
        if (FarmingAssets && FarmingAssets.length > 0) {
            const sqlUpdateFarmingAssets = `
                UPDATE FarmingAssets
                SET AssetName = ?, Quantity = ?
                WHERE farmerID = ? AND AssetID = ?`;

            for (const asset of FarmingAssets) {
                if (asset.AssetID) { // Update existing farming asset
                    await pool.query(sqlUpdateFarmingAssets, [
                        asset.AssetName,
                        asset.Quantity || 0,
                        farmerId,
                        asset.AssetID // Assuming each farming asset has a unique identifier (AssetID)
                    ]);
                } else { // Insert new farming asset
                    const sqlInsertFarmingAssets = `
                        INSERT INTO FarmingAssets (AssetName, Quantity, farmerID)
                        VALUES (?, ?, ?)`;
                    await pool.query(sqlInsertFarmingAssets, [
                        asset.AssetName,
                        asset.Quantity || 0,
                        farmerId
                    ]);
                }
            }
        }


        res.send({ message: "Farmer updated successfully" });
    } catch (error) {
        console.error('Error updating farmer:', error);
        res.status(500).send('Internal Server Error');
    }
});
















// item 

// Route for fetching all items
app.get("/api/items", async (req, res) => {
    try {
        const sqlGet = "SELECT * FROM Item";
        const [result] = await pool.query(sqlGet);
        res.send(result);
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route for inserting a new item
app.post("/api/items", async (req, res) => {
    const { type, price } = req.body;
    const sqlInsert = "INSERT INTO Item (type, price) VALUES (?, ?)";
    
    try {
        const [result] = await pool.query(sqlInsert, [type, price]);
        res.send({ message: "Item inserted successfully", insertedData: req.body });
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route for deleting an item by ID
app.delete("/api/items/:id", async (req, res) => {
    const { id } = req.params;
    const sqlRemove = "DELETE FROM Item WHERE itemId = ?";
    
    try {
        const [result] = await pool.query(sqlRemove, [id]);
        
        if (result.affectedRows === 0) {
            res.status(404).send({ message: "Item not found" });
            return;
        }
        
        res.send({ message: "Item deleted successfully", deletedId: id });
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route for updating an item by ID
app.put("/api/items/:id", async (req, res) => {
    const { id } = req.params;
    const { type, price } = req.body;
    const sqlUpdate = "UPDATE Item SET type = ?, price = ? WHERE itemId = ?";
    
    try {
        const [result] = await pool.query(sqlUpdate, [type, price, id]);
        
        if (result.affectedRows === 0) {
            res.status(404).send({ message: "Item not found" });
            return;
        }
        
        res.send({ message: "Item updated successfully", updatedId: id });
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});


// // Route for fetching all supplies
// app.get("/api/supplies", (req, res) => {
//     const sqlGet = "SELECT * FROM Supply";
//     pool.query(sqlGet, (error, result) => {
//         if (error) {
//             console.error('Error executing SQL:', error);
//             res.status(500).send('Internal Server Error');
//             return;
//         }
//         res.send(result);
//     });
// });

// Route for fetching all supplies
app.get("/api/supplies", async (req, res) => {
    const sqlGet = "SELECT Supply.supplyId, Supply.farmerId, Supply.issuedDate, Supply.type, Supply.quantity, farmer.Name AS farmerName, (item.price * Supply.quantity) AS totalPrice FROM managefarmers.Supply LEFT JOIN farmer ON farmer.farmerID = Supply.farmerID LEFT JOIN item ON Supply.type = item.type;";
    
    try {
        const [rows] = await pool.query(sqlGet);
        res.send(rows);
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/api/farmer/:farmerId", async (req, res) => {
    const { farmerId } = req.params;
    try {
        const sqlSelectFarmerName = "SELECT farmerName FROM Farmer WHERE farmerId = ?";
        const [rows] = await pool.query(sqlSelectFarmerName, [farmerId]);

        if (rows.length > 0) {
            res.send(rows[0]); // Assuming you want to send just the farmerName
        } else {
            res.status(404).send({ message: "Farmer not found" });
        }
    } catch (error) {
        console.error('Error fetching farmer name:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.post("/api/supplies", async (req, res) => {
    console.log(req.body);
    const { farmerId, issuedDate, totalPrice, typeQuantities } = req.body;

    // SQL query for inserting a new supply entry
    const sqlInsert = "INSERT INTO Supply (farmerId, issuedDate, type, quantity, totalPrice) VALUES (?, ?, ?, ?, ?)";

    try {
        // Begin a transaction
        await pool.query('START TRANSACTION');

        // Insert each type and quantity from the typeQuantities array
        for (const { type, quantity } of typeQuantities) {
            await pool.query(sqlInsert, [farmerId, issuedDate, type, quantity, totalPrice]);
        }

        // Commit the transaction
        await pool.query('COMMIT');
        
        res.send({ message: "Supplies inserted successfully", insertedData: req.body });
    } catch (error) {
        // Rollback the transaction in case of an error
        await pool.query('ROLLBACK');
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});



// app.get("/api/farmer/:farmerId", async (req, res) => {
//     const { farmerId } = req.params;
//     try {
//         const sqlSelectFarmerName = "SELECT farmerName FROM Farmer WHERE farmerId = ?";
//         const [rows] = await pool.query(sqlSelectFarmerName, [farmerId]);

//         if (rows.length > 0) {
//             res.send(rows[0]);
//         } else {
//             res.status(404).send({ message: "Farmer not found" });
//         }
//     } catch (error) {
//         console.error('Error fetching farmer name:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });


// app.post("/api/supplies", async (req, res) => {
//     console.log(req.body);
//     const { farmerId, farmerName, issuedDate, totalPrice, typeQuantities } = req.body;

//     // SQL query for inserting a new supply entry
//     const sqlInsert = "INSERT INTO Supply (farmerId, farmerName, issuedDate, type, quantity, totalPrice) VALUES (?, ?, ?, ?, ?, ?)";

//     try {
//         // Begin a transaction
//         await pool.query('START TRANSACTION');

//         // Insert each type and quantity from the typeQuantities array
//         for (const { type, quantity } of typeQuantities) {
//             await pool.query(sqlInsert, [farmerId, farmerName, issuedDate, type, quantity, totalPrice]);
//         }

//         // Commit the transaction
//         await pool.query('COMMIT');
        
//         res.send({ message: "Supplies inserted successfully", insertedData: req.body });
//     } catch (error) {
//         // Rollback the transaction in case of an error
//         await pool.query('ROLLBACK');
//         console.error('Error executing SQL:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });



// Route for deleting a supply by ID
app.delete("/api/supplies/:id", async (req, res) => {
    const { id } = req.params;
    const sqlRemove = "DELETE FROM Supply WHERE supplyId = ?";
    
    try {
        await pool.query(sqlRemove, [id]);
        res.send({ message: "Supply deleted successfully", deletedId: id });
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/api/supplies/:id", async (req, res) => {
    const { id } = req.params;
    const sqlRemove = "SELECT * FROM Supply WHERE supplyId = ?";
    
    try {
        
        const [results] = await pool.query(sqlRemove, [id]);

        if (results.length > 0) {
            res.send(results); // Assuming you want to send just the farmerName
        } else {
            res.status(404).send({ message: "Supplies not found" });
        }
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Route for updating a supply by ID
app.put("/api/supplies/:id", async (req, res) => {
    const { id } = req.params;
    const { farmerId, type, quantity, totalPrice } = req.body;
    const sqlUpdate = "UPDATE Supply SET farmerId = ?, type = ?, quantity = ?, totalPrice = ? WHERE supplyId = ?";
    
    try {
        await pool.query(sqlUpdate, [farmerId, type, quantity, totalPrice, id]);
        res.send({ message: "Supply updated successfully", updatedId: id });
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});












app.get("/api/products", async (req, res) => {
    const sqlGet = "SELECT * FROM Product";
    try {
        const [result] = await pool.query(sqlGet);
        res.send(result);
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});




// Route for inserting a new product
app.post("/api/products", async (req, res) => {
    const { productType, productPrice } = req.body;
    const sqlInsert = "INSERT INTO Product (productType, productPrice) VALUES (?, ?)";
    
    try {
        const [result] = await pool.query(sqlInsert, [productType, productPrice]);
        res.send({ message: "Product inserted successfully", insertedData: req.body });
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route for deleting a product by ID
app.delete("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const sqlRemove = "DELETE FROM Product WHERE productId = ?";
    
    try {
        const [result] = await pool.query(sqlRemove, [id]);
        
        if (result.affectedRows === 0) {
            res.status(404).send({ message: "Product not found" });
            return;
        }
        
        res.send({ message: "Product deleted successfully", deletedId: id });
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route for updating a product by ID
app.put("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const { productType, productPrice } = req.body;
    const sqlUpdate = "UPDATE Product SET productType = ?, productPrice = ? WHERE productId = ?";
    
    try {
        const [result] = await pool.query(sqlUpdate, [productType, productPrice, id]);
        
        if (result.affectedRows === 0) {
            res.status(404).send({ message: "Product not found" });
            return;
        }
        
        res.send({ message: "Product updated successfully", updatedId: id });
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});





app.get("/api/collections", async (req, res) => {
    const sqlGet = "SELECT * FROM Collection";
    try {
        const [result] = await pool.query(sqlGet);
        res.send(result);
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.post("/api/collections", async (req, res) => {
    const { farmerId, collectionDate, productType, amount, totPrice } = req.body;

    const sqlSelectFarmerName = `
        SELECT Name AS farmerName
        FROM farmer
        WHERE farmerID = ?
    `;

    const sqlInsertCollection = `
        INSERT INTO Collection (farmerId, farmerName, collectionDate, productType, amount, totPrice)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Fetch the farmerName corresponding to the provided farmerId
        const [selectResult] = await connection.query(sqlSelectFarmerName, [farmerId]);

        if (selectResult.length === 0) {
            res.status(404).send('Farmer not found');
            return;
        }

        const farmerName = selectResult[0].farmerName;

        // Insert the collection record
        await connection.query(sqlInsertCollection, [farmerId, farmerName, collectionDate, productType, amount, totPrice]);

        await connection.commit();
        res.send({ message: "Collection inserted successfully", insertedData: req.body });
    } catch (error) {
        await connection.rollback();
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        connection.release();
    }
});


// Route for deleting a collection by ID
app.delete("/api/collections/:id", async (req, res) => {
    const { id } = req.params;
    const sqlRemove = "DELETE FROM Collection WHERE collectionId = ?";

    try {
        const [result] = await pool.query(sqlRemove, [id]);
        
        if (result.affectedRows === 0) {
            res.status(404).send({ message: "Collection not found" });
            return;
        }

        res.send({ message: "Collection deleted successfully", deletedId: id });
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});




// Route for updating a collection by ID
app.put("/api/collections/:id", async (req, res) => {
    const { id } = req.params;
    const { farmerId, farmerName, collectionDate, productType, amount, totPrice } = req.body;
    const sqlUpdate = `
        UPDATE Collection 
        SET farmerId = ?, farmerName = ?, collectionDate = ?, productType = ?, amount = ?, totPrice = ?
        WHERE collectionId = ?
    `;

    try {
        const [result] = await pool.query(sqlUpdate, [farmerId, farmerName, collectionDate, productType, amount, totPrice, id]);
        
        if (result.affectedRows === 0) {
            res.status(404).send({ message: "Collection not found" });
            return;
        }

        res.send({ message: "Collection updated successfully", updatedId: id });
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});















const multer = require('multer');
const ErrorHandler = require('./utils/errorHandler');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/photos');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// GET endpoint to fetch status
app.get("/api/status", async (req, res) => {
    const sqlSelect = `
        SELECT s.*, f.Name AS farmerName, l.AIRange
        FROM Status s
        JOIN farmer f ON s.farmerId = f.farmerID
        JOIN Location l ON l.farmerID = f.farmerID;
    `;
    try {
        const [result] = await pool.query(sqlSelect);
        console.log('SQL Result:', result); // Log the raw SQL result
    
        // Parse JSON strings in the result
        const parsedResult = result.map(item => {
            const parsedItem = {...item}; // Ensure we create a new object
    
            try {
                parsedItem.identifiedIssues = JSON.parse(item.identifiedIssues);
            } catch (error) {
                console.error('Error parsing identifiedIssues JSON:', error);
                parsedItem.identifiedIssues = null; // Or some default value
            }
            try {
                parsedItem.neededResources = JSON.parse(item.neededResources);
            } catch (error) {
                console.error('Error parsing neededResources JSON:', error);
                parsedItem.neededResources = null; // Or some default value
            }
            try {
                parsedItem.ribbonCount = JSON.parse(item.ribbonCount);
            } catch (error) {
                console.error('Error parsing ribbonCount JSON:', error);
                parsedItem.ribbonCount = null; // Or some default value
            }
            try {
                parsedItem.photos = item.photos ? JSON.parse(item.photos) : null;
            } catch (error) {
                console.error('Error parsing photos JSON:', error);
                parsedItem.photos = null; // Or some default value
            }
    
            console.log('Parsed Item:', parsedItem); // Log each parsed item
            return parsedItem;
        });
    
        console.log('Parsed Result:', parsedResult); // Log the final parsed result
        res.send(parsedResult);
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});










app.get("/api/ribbonCount", async (req, res) => {
    const sqlGetRibbonCount = `
        SELECT f.farmerID, f.Name, l.AIRange, rc.*
        FROM farmer f
        JOIN Location l ON f.farmerID = l.farmerID
        JOIN RibbonCount rc ON f.farmerID = rc.farmerID
    `;
    try {
        const [result] = await pool.query(sqlGetRibbonCount);
        res.send(result);
    } catch (error) {
        console.error('Error fetching ribbon counts:', error);
        res.status(500).send('Internal Server Error');
    }
});



// POST endpoint to insert status
app.post("/api/status", upload.array('photos', 5), async (req, res) => {
    const {
        farmerId, date, identifiedIssues, neededResources, ribbonCount, inputActivity, inputUsedQuantity, inputUsedCost, 
        machineryHours, machineryCost, labourHours, labourCost, soldAtEventsQuantity, soldAtEventsIncome, destroyedQuantity,
        soldLocallyQuantity, soldLocallyIncome, comments 
    } = req.body;
    const photos = req.files.map(file => file.path);

    // Parse JSON data with better error handling
    let parsedIdentifiedIssues, parsedNeededResources, parsedRibbonCount;
    try {
        parsedIdentifiedIssues = JSON.parse(identifiedIssues);
        parsedNeededResources = JSON.parse(neededResources);
        parsedRibbonCount = JSON.parse(ribbonCount);
    } catch (e) {
        console.error('Error parsing JSON data:', e);
        res.status(400).send('Invalid JSON format');
        return;
    }

    if (!Array.isArray(parsedIdentifiedIssues) || !Array.isArray(parsedNeededResources) || !Array.isArray(parsedRibbonCount)) {
        console.error('Parsed data is not an array:', {
            identifiedIssues: parsedIdentifiedIssues,
            neededResources: parsedNeededResources,
            ribbonCount: parsedRibbonCount,
        });
        res.status(400).send('Invalid JSON structure');
        return;
    }

    const sqlInsert = `
        INSERT INTO Status (
            farmerId, date, identifiedIssues, neededResources, ribbonCount, inputActivity, inputUsedQuantity, inputUsedCost, 
            machineryHours, machineryCost, labourHours, labourCost, soldAtEventsQuantity, soldAtEventsIncome, destroyedQuantity, 
            soldLocallyQuantity, soldLocallyIncome, comments, photos
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const result = await pool.query(
            sqlInsert,
            [
                farmerId, date, JSON.stringify(parsedIdentifiedIssues), JSON.stringify(parsedNeededResources), JSON.stringify(parsedRibbonCount),
                inputActivity || null, inputUsedQuantity || null, inputUsedCost || null, machineryHours || null, machineryCost || null, 
                labourHours || null, labourCost || null, soldAtEventsQuantity || null, soldAtEventsIncome || null, destroyedQuantity || null,
                soldLocallyQuantity || null, soldLocallyIncome || null, comments, photos.length > 0 ? JSON.stringify(photos) : null
            ]
        );

        // Update the RibbonCount table
        const updateRibbonCounts = parsedRibbonCount.map(({ color, count, action }) => {
            const column = color.toLowerCase();
            const operator = action === 'IN' ? '+' : '-';
            const sqlUpdateRibbonCount = `
                UPDATE RibbonCount
                SET ${column} = ${column} ${operator} ?
                WHERE farmerId = ?
            `;
            return pool.query(sqlUpdateRibbonCount, [count, farmerId]);
        });

        await Promise.all(updateRibbonCounts);

        res.send({ message: "Status inserted and data updated successfully", insertedData: req.body });
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});






app.get("/api/farmerslist", async (req, res) => {
    const sqlGetFarmers = `
        SELECT f.farmerID, f.Name as farmerName, l.AIRange
        FROM farmer f
        JOIN Location l ON f.farmerID = l.farmerID
    `;
    try {
        const [result] = await pool.query(sqlGetFarmers); // Use pool.query instead of query
        res.send(result); // Since result is an array, we access the first element to get the data
    } catch (error) {
        console.error('Error executing SQL:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/api/identifiedIssues", async (req, res) => {
    const sqlGetIssues = `
        SELECT identifiedIssues
        FROM Status
    `;

    try {
        const [rows, fields] = await pool.query(sqlGetIssues);

        const issuesCount = {};
        rows.forEach(item => {
            const issues = JSON.parse(item.identifiedIssues);
            if (Array.isArray(issues)) {
                issues.forEach(issue => {
                    if (issuesCount[issue]) {
                        issuesCount[issue] += 1;
                    } else {
                        issuesCount[issue] = 1;
                    }
                });
            } else {
                // Handle case where identifiedIssues is not an array if necessary
                console.error('Expected an array, but got:', issues);
            }
        });

        res.send(issuesCount);
    } catch (error) {
        console.error('Error fetching identified issues:', error);
        res.status(500).send('Internal Server Error');
    }
});







// // Server-side endpoint to reset a ribbon count column
// app.post('/api/resetRibbonCount', (req, res) => {
//     const { color } = req.body;
//     const column = color.toLowerCase();

//     // SQL query to reset the specified column for all records in the RibbonCount table
//     const sqlResetRibbonCount = `
//         UPDATE RibbonCount
//         SET ${column} = 0
//     `;

//     // Execute the SQL query
//     pool.query(sqlResetRibbonCount, (error, result) => {
//         if (error) {
//             console.error(`Error resetting ${color} column:`, error);
//             res.status(500).send('Internal Server Error');
//             return;
//         }
//         res.send({ message: `${color} column reset successfully` });
//     });
// });

// // Server-side endpoint to reset a ribbon count column
// app.post('/api/resetRibbonCount', (req, res) => {
//     const { color } = req.body;
//     const column = color.toLowerCase();

//     // SQL query to reset the specified column for all records in the RibbonCount table
//     const sqlResetRibbonCount = `
//         UPDATE RibbonCount
//         SET ${column} = 0
//     `;

//     // Execute the SQL query using MySQL2
//     pool.promise().query(sqlResetRibbonCount)
//         .then(([rows, fields]) => {
//             res.send({ message: `${color} column reset successfully` });
//         })
//         .catch((error) => {
//             console.error(`Error resetting ${color} column:`, error);
//             res.status(500).send('Internal Server Error');
//         });
// });

// // Server-side endpoint to reset a ribbon count column
// app.post('/api/resetRibbonCount', async (req, res) => {
//     const { color } = req.body;
//     const column = color.toLowerCase();

//     // SQL query to reset the specified column for all records in the RibbonCount table
//     const sqlResetRibbonCount = `
//         UPDATE RibbonCount
//         SET ${column} = 0
//     `;

//     try {
//         // Execute the SQL query using MySQL2's promise-based API
//         const [rows, fields] = await pool.query(sqlResetRibbonCount);
//         res.send({ message: `${color} column reset successfully` });
//     } catch (error) {
//         console.error(`Error resetting ${color} column:`, error);
//         res.status(500).send('Internal Server Error');
//     }
// });

const moment = require('moment');

app.post('/api/resetRibbonCount', async (req, res) => {
    const { color, resetStartDate, resetEndDate } = req.body;

    // Validate inputs
    if (!color || !resetStartDate) {
        return res.status(400).send('Invalid request: Missing color or reset start date');
    }

    const validColors = ['red', 'blue', 'green', 'yellow', 'orange', 'black', 'purple', 'white'];
    if (!validColors.includes(color.toLowerCase())) {
        return res.status(400).send('Invalid color specified');
    }

    // Format dates to 'YYYY-MM-DD' format
    const formattedResetStartDate = moment(resetStartDate).format('YYYY-MM-DD');
    const formattedResetEndDate = resetEndDate ? moment(resetEndDate).format('YYYY-MM-DD HH:mm:ss') : null;

    try {
        // SQL query to reset the specified column for all records in the RibbonCount table
        const sqlResetRibbonCount = `
            UPDATE RibbonCount
            SET ${color.toLowerCase()} = 0,
                ${color.toLowerCase()}StartDate = ?,
                ${color.toLowerCase()}EndDate = ?
        `;

        // Execute the SQL query using MySQL2's promise-based API
        await pool.query(sqlResetRibbonCount, [formattedResetStartDate, formattedResetEndDate]);

        res.send({ message: `${color} column reset successfully` });
    } catch (error) {
        console.error(`Error resetting ${color} column:`, error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/ribbonDates', async (req, res) => {
    try {
        const sqlFetchRibbonDates = `
            SELECT
                blueStartDate, blueEndDate,
                redStartDate, redEndDate,
                yellowStartDate, yellowEndDate,
                whiteStartDate, whiteEndDate,
                purpleStartDate, purpleEndDate,
                orangeStartDate, orangeEndDate,
                blackStartDate, blackEndDate,
                pinkStartDate, pinkEndDate
            FROM RibbonCount
        `;

        const [rows] = await pool.query(sqlFetchRibbonDates);

        if (rows.length === 0) {
            return res.status(404).send('No data found in RibbonCount');
        }

        const result = rows[0];

        const response = {
            startDates: {
                blue: result.blueStartDate,
                red: result.redStartDate,
                yellow: result.yellowStartDate,
                white: result.whiteStartDate,
                purple: result.purpleStartDate,
                orange: result.orangeStartDate,
                black: result.blackStartDate,
                pink: result.pinkStartDate,
            },
            endDates: {
                blue: result.blueEndDate,
                red: result.redEndDate,
                yellow: result.yellowEndDate,
                white: result.whiteEndDate,
                purple: result.purpleEndDate,
                orange: result.orangeEndDate,
                black: result.blackEndDate,
                pink: result.pinkEndDate,
            }
        };

        res.send(response);
    } catch (error) {
        console.error('Error fetching ribbon dates:', error);
        res.status(500).send({ message: 'Internal Server Error', error });
    }
});



// // Route to fetch income and expenses data
// app.get('/api/income-expenses', async (req, res) => {
//     try {
//         const sqlQuery = `
//             WITH AllRecords AS (
//                 SELECT farmerID, collectionDate AS date FROM Collection
//                 UNION
//                 SELECT farmerID, issuedDate AS date FROM Supply
//                 UNION
//                 SELECT farmerID, date FROM Status
//                 WHERE 
//                     inputActivity IS NOT NULL 
//                     OR inputUsedQuantity IS NOT NULL
//                     OR inputUsedCost IS NOT NULL
//                     OR machineryHours IS NOT NULL
//                     OR machineryCost IS NOT NULL
//                     OR labourHours IS NOT NULL
//                     OR labourCost IS NOT NULL
//                     OR soldAtEventsQuantity IS NOT NULL
//                     OR soldAtEventsIncome IS NOT NULL
//                     OR destroyedQuantity IS NOT NULL
//                     OR soldLocallyQuantity IS NOT NULL
//                     OR soldLocallyIncome IS NOT NULL
//             )
//             SELECT 
//                 ar.farmerID, 
//                 COALESCE(f.Name, '') AS farmerName, 
//                 COALESCE(l.AIRange, '') AS AIRange,
//                 ar.date,
//                 c.amount AS exportQuantity, 
//                 c.totPrice AS exportIncome,
//                 sup.type AS suppliesList,
//                 sup.totalPrice AS suppliesCost,
//                 s.inputActivity,
//                 s.inputUsedQuantity,
//                 s.inputUsedCost,
//                 s.machineryHours,
//                 s.machineryCost,
//                 s.labourHours,
//                 s.labourCost,
//                 s.soldAtEventsQuantity,
//                 s.soldAtEventsIncome,
//                 s.destroyedQuantity,
//                 s.soldLocallyQuantity,
//                 s.soldLocallyIncome
//             FROM 
//                 AllRecords ar
//             LEFT JOIN Collection c ON ar.farmerID = c.farmerID AND ar.date = c.collectionDate
//             LEFT JOIN Supply sup ON ar.farmerID = sup.farmerID AND ar.date = sup.issuedDate
//             LEFT JOIN (
//                 SELECT * FROM Status 
//                 WHERE 
//                     inputActivity IS NOT NULL 
//                     OR inputUsedQuantity IS NOT NULL
//                     OR inputUsedCost IS NOT NULL
//                     OR machineryHours IS NOT NULL
//                     OR machineryCost IS NOT NULL
//                     OR labourHours IS NOT NULL
//                     OR labourCost IS NOT NULL
//                     OR soldAtEventsQuantity IS NOT NULL
//                     OR soldAtEventsIncome IS NOT NULL
//                     OR destroyedQuantity IS NOT NULL
//                     OR soldLocallyQuantity IS NOT NULL
//                     OR soldLocallyIncome IS NOT NULL
//             ) s ON ar.farmerID = s.farmerID AND ar.date = s.date
//             LEFT JOIN Location l ON ar.farmerID = l.farmerID
//             LEFT JOIN Farmer f ON ar.farmerID = f.farmerID
//             ORDER BY 
//                 ar.date ASC;
//         `;
        
//         pool.query(sqlQuery, (error, results) => {
//             if (error) {
//                 console.error('Error executing SQL:', error);
//                 res.status(500).send('Internal Server Error');
//             } else {
//                 res.json(results);
//             }
//         });
//     } catch (error) {
//         console.error('Error fetching income and expenses data:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// Route to fetch income and expenses data
app.get('/api/income-expenses', async (req, res) => {
    try {
        const sqlQuery = `
            WITH AllRecords AS (
                SELECT farmerID, collectionDate AS date FROM Collection
                UNION
                SELECT farmerID, issuedDate AS date FROM Supply
                UNION
                SELECT farmerID, date FROM Status
                WHERE 
                    inputActivity IS NOT NULL 
                    OR inputUsedQuantity IS NOT NULL
                    OR inputUsedCost IS NOT NULL
                    OR machineryHours IS NOT NULL
                    OR machineryCost IS NOT NULL
                    OR labourHours IS NOT NULL
                    OR labourCost IS NOT NULL
                    OR soldAtEventsQuantity IS NOT NULL
                    OR soldAtEventsIncome IS NOT NULL
                    OR destroyedQuantity IS NOT NULL
                    OR soldLocallyQuantity IS NOT NULL
                    OR soldLocallyIncome IS NOT NULL
            )
            SELECT 
                ar.farmerID, 
                COALESCE(f.Name, '') AS farmerName, 
                COALESCE(l.AIRange, '') AS AIRange,
                ar.date,
                c.amount AS exportQuantity, 
                c.totPrice AS exportIncome,
                sup.type AS suppliesList,
                sup.totalPrice AS suppliesCost,
                s.inputActivity,
                s.inputUsedQuantity,
                s.inputUsedCost,
                s.machineryHours,
                s.machineryCost,
                s.labourHours,
                s.labourCost,
                s.soldAtEventsQuantity,
                s.soldAtEventsIncome,
                s.destroyedQuantity,
                s.soldLocallyQuantity,
                s.soldLocallyIncome
            FROM 
                AllRecords ar
            LEFT JOIN Collection c ON ar.farmerID = c.farmerID AND ar.date = c.collectionDate
            LEFT JOIN Supply sup ON ar.farmerID = sup.farmerID AND ar.date = sup.issuedDate
            LEFT JOIN (
                SELECT * FROM Status 
                WHERE 
                    inputActivity IS NOT NULL 
                    OR inputUsedQuantity IS NOT NULL
                    OR inputUsedCost IS NOT NULL
                    OR machineryHours IS NOT NULL
                    OR machineryCost IS NOT NULL
                    OR labourHours IS NOT NULL
                    OR labourCost IS NOT NULL
                    OR soldAtEventsQuantity IS NOT NULL
                    OR soldAtEventsIncome IS NOT NULL
                    OR destroyedQuantity IS NOT NULL
                    OR soldLocallyQuantity IS NOT NULL
                    OR soldLocallyIncome IS NOT NULL
            ) s ON ar.farmerID = s.farmerID AND ar.date = s.date
            LEFT JOIN Location l ON ar.farmerID = l.farmerID
            LEFT JOIN Farmer f ON ar.farmerID = f.farmerID
            ORDER BY 
                ar.date ASC;
        `;

        const results = await pool.query(sqlQuery);
        res.json(results);
    } catch (error) {
        console.error('Error fetching income and expenses data:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.use(ErrorMiddleware);

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});