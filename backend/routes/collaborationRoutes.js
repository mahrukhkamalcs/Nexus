const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const {

createRequest,

getEntrepreneurRequests,

getInvestorRequests,

acceptRequest,

rejectRequest,

} = require("../controllers/collaborationController");




// Investor sends request

router.post(

"/",

authMiddleware,

roleMiddleware("investor"),

createRequest

);




// Entrepreneur receives requests

router.get(

"/entrepreneur",

authMiddleware,

roleMiddleware("entrepreneur"),

getEntrepreneurRequests

);




// Investor sent requests

router.get(

"/investor",

authMiddleware,

roleMiddleware("investor"),

getInvestorRequests

);




// Accept

router.put(

"/:id/accept",

authMiddleware,

roleMiddleware("entrepreneur"),

acceptRequest

);




// Reject

router.put(

"/:id/reject",

authMiddleware,

roleMiddleware("entrepreneur"),

rejectRequest

);

module.exports = router;