
import { Router } from "express";
import { getAllNotes, getNoteById, createNote, deleteNote, updateNote } from '../controllers/notesController.js';

import { celebrate, Segments } from 'celebrate';
import { getAllNotesSchema } from "../validations/notesValidation.js";


const router = Router();

router.get('/notes', celebrate(getAllNotesSchema), getAllNotes);

router.get('/notes/:noteId', getNoteById);

router.post('/notes', createNote);

router.delete('/notes/:noteId', deleteNote);

router.patch('/notes/:noteId', updateNote);

export default router;
