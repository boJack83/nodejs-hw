import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

// Отримати список усіх нотатків
export const getAllNotes = async (req, res) => {

  const { page = 1, perPage = 10, tag, search} = req.query;
  const skip = (page - 1) * perPage;

  // Фільтр підрахунку
   const countQuery = Note.find();
  if (req.query.tag) {
    countQuery.where("tag").equals(tag);
  }
  if (req.query.search) {
    countQuery.where({ $text: { $search: search } });
  };

  // Фільтр вибірки
   const notesQuery = Note.find();
  if (req.query.tag) {
    notesQuery.where("tag").equals(tag);
  }
  if (req.query.search) {
    notesQuery.where({ $text: { $search: search } });
  };



  const [totalNotes, notes] = await Promise.all([
    countQuery.countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalNotes / perPage);
  res.status(200).json({ page, perPage, totalNotes, totalPages, notes,});
};




// Отримати одну нотатку за id
export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json(note);
};

// Створити нову нотатку
export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

// Видалення нотатки за id
export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({_id: noteId,});

  if (!note) {
    next(createHttpError(404, "Note not found"));
    return;
  }
  res.status(200).json(note);
};

// Оновлення нотатки за id

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId }, // Шукаємо по id
    req.body,
    { new: true }, // Повертаємо оновлений документ
  );

  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }

  res.status(200).json(note);
};
