// controllers/formController.js

import FormModel from '../models/formModel.js';

// Create a new form entry
export const createForm = async (req, res) => {
    try {
        const formData = req.body;
        const newForm = new FormModel(formData);
        await newForm.save();
        res.status(201).json(newForm);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all form entries
export const getForms = async (req, res) => {
    try {
        const forms = await FormModel.find();
        res.status(200).json(forms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single form entry by ID
export const getFormById = async (req, res) => {
    try {
        const form = await FormModel.findById(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.status(200).json(form);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a form entry by ID
export const updateForm = async (req, res) => {
    try {
        const form = await FormModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.status(200).json(form);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a form entry by ID
export const deleteForm = async (req, res) => {
    try {
        const form = await FormModel.findByIdAndDelete(req.params.id);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
        res.status(200).json({ message: 'Form deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
