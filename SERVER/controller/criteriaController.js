const Criteria = require("../models/Criteria");


// Add Criteria for a Classroom
const addCriteria = async (req, res) => {
    const { cpi, min_group_size, max_group_size, division } = req.body;
    console.log(cpi);
    

    try {
        // Ensure CPI is within 0-10
        if (cpi < 0 || cpi > 10) {
            return res.status(400).json({ message: "CPI must be between 0 and 10" });
        }


        // Ensure min_group_size is at least 1 and max_group_size is at most 5
        if (min_group_size > max_group_size &&  min_group_size < 1 || max_group_size > 5) {
            return res.status(400).json({ message: "min_group_size must be at least 1 and max_group_size must be at most 5" });
        }

        const criteria = new Criteria({ cpi, min_group_size, max_group_size, division });
        await criteria.save();


        res.status(201).json({ message: "Criteria added successfully", criteria });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Get Criteria by ID
const getCriteriaById = async (req, res) => {
    const criteriaId = req.params.Id;


    try {
        const criteria = await Criteria.findOne({ criteriaId });


        if (!criteria) {
            return res.status(404).json({ message: "Criteria not found for this classroom" });
        }


        res.json(criteria);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Get all Criteria entries
const getAllCriteria = async (req, res) => {
    try {
        const criteriaList = await Criteria.find();
        res.json(criteriaList);
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Update Criteria
const updateCriteria = async (req, res) => {
    const criteriaId = req.params.criteriaId;
    const { cpi, min_group_size, max_group_size, division } = req.body;


    try {
        // Ensure CPI is within 0-10
        if (cpi < 0 || cpi > 10) {
            return res.status(400).json({ message: "CPI must be between 0 and 10" });
        }


        // Ensure min_group_size is at least 1 and max_group_size is at most 5
        if (min_group_size  >  max_group_size && min_group_size < 1 || max_group_size > 5) {
            return res.status(400).json({ message: "min_group_size must be at least 1 and max_group_size must be at most 5" });
        }


        const updatedCriteria = await Criteria.findByIdAndUpdate(
            criteriaId,
            { cpi, min_group_size, max_group_size, division, updatedAt: Date.now() },
            { new: true }
        );


        if (!updatedCriteria) {
            return res.status(404).json({ message: "Criteria not found" });
        }


        res.json({ message: "Criteria updated successfully", updatedCriteria });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


// Delete Criteria by ID
const deleteCriteriaById = async (req, res) => {
    const criteriaId = req.params.criteriaId;


    try {
        const criteria = await Criteria.findByIdAndDelete(criteriaId);
        if (!criteria) {
            return res.status(404).json({ message: "Criteria not found" });
        }


        res.json({ message: "Criteria deleted successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server Error: " + err });
    }
};


module.exports = {
    addCriteria,
    getCriteriaById,
    getAllCriteria,
    updateCriteria,
    deleteCriteriaById
};