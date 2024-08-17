// routes/formRoutes.js

import express from 'express';
import { 
    createForm, 
    getForms, 
    getFormById, 
    updateForm, 
    deleteForm 
} from '../controllers/formController.js';

const router = express.Router();

// Route for creating a new form entry
router.post('/forms', createForm);

// Route for getting all form entries
router.get('/forms', getForms);

// Route for getting a single form entry by ID
router.get('/forms/:id', getFormById);

// Route for updating a form entry by ID
router.put('/forms/:id', updateForm);

// Route for deleting a form entry by ID
router.delete('/forms/:id', deleteForm);

export default router;
