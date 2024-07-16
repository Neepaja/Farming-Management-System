// const pool = require('../config/database'); 


// const getFarmers = async (req, res) => {
//     const sqlGet = "SELECT * FROM farmer";
//     try {
//         const [result] = await pool.query(sqlGet);
//         res.send(result);
//     } catch (error) {
//         console.error('Error executing SQL:', error);
//         res.status(500).send('Internal Server Error');
//     }
// };


// module.exports = {
//     getFarmers
// };