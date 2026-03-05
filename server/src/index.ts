import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "./models/User";
import { Book } from "./models/Book";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const secret = process.env.JWT_SECRET || "dev-secret";

app.use(cors());
app.use(express.json());

const auth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.replace("Bearer ", "");
	if (!token) return res.status(401).json({ error: "Unauthorized" });
	try {
		const decoded = jwt.verify(token, secret) as { userId: string };
		(req as Request & { userId: string }).userId = decoded.userId;
		next();
	} catch {
		res.status(401).json({ error: "Invalid token" });
	}
};

app.get("/api/health", (_, res) => res.json({ ok: true }));

app.post("/api/auth/signup", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password || password.length < 6)
			return res.status(400).json({ error: "Email and password (min 6 chars) required" });
		if (await User.findOne({ email }))
			return res.status(409).json({ error: "Email already registered" });
		const user = await User.create({ email, password: await bcrypt.hash(password, 10) });
		const u = user.toObject();
		delete (u as Record<string, unknown>).password;
		return res.status(201).json({ user: u });
	} catch (err) {
		console.error("Signup error:", err);
		res.status(500).json({ error: "Sign up failed" });
	}
});

app.post("/api/auth/login", async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).json({ error: "Email and password required" });
	const user = await User.findOne({ email });
	if (!user || !(await bcrypt.compare(password, user.password)))
		return res.status(401).json({ error: "Invalid email or password" });
	const token = jwt.sign({ userId: user._id.toString() }, secret, { expiresIn: "7d" });
	res.json({ token });
});

app.get("/api/me", auth, async (req, res) => {
	const user = await User.findById((req as Request & { userId: string }).userId).select("-password");
	if (!user) return res.status(401).json({ error: "User not found" });
	res.json({ user });
});

app.post("/api/books", auth, async (req, res) => {
	const uid = (req as Request & { userId: string }).userId;
	const { title, author, tags, status } = req.body;
	if (!title || !author) return res.status(400).json({ error: "Title and author required" });
	const book = await Book.create({ title, author, tags: tags || [], status: status || "wantToRead", userId: uid });
	res.status(201).json(book);
});

app.get("/api/books", auth, async (req, res) => {
	const uid = (req as Request & { userId: string }).userId;
	const { tag, status } = req.query;
	const filter: Record<string, unknown> = { userId: uid };
	if (tag) filter.tags = tag;
	if (status) filter.status = status;
	const books = await Book.find(filter).sort({ createdAt: -1 });
	res.json(books);
});

app.patch("/api/books/:id", auth, async (req, res) => {
	const uid = (req as Request & { userId: string }).userId;
	const book = await Book.findOne({ _id: req.params.id, userId: uid });
	if (!book) return res.status(404).json({ error: "Book not found" });
	const { title, author, tags, status } = req.body;
	if (title) book.title = title;
	if (author) book.author = author;
	if (Array.isArray(tags)) book.tags = tags;
	if (status) book.status = status;
	await book.save();
	res.json(book);
});

app.delete("/api/books/:id", auth, async (req, res) => {
	const deleted = await Book.findOneAndDelete({ _id: req.params.id, userId: (req as Request & { userId: string }).userId });
	if (!deleted) return res.status(404).json({ error: "Book not found" });
	res.json({ ok: true });
});

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
	console.error("MONGODB_URI is not set");
	process.exit(1);
}

mongoose
	.connect(MONGODB_URI, {
		serverSelectionTimeoutMS: 30000,
	})
	.then(() => {
		console.log("MongoDB connected");
		app.listen(PORT, () => console.log(`Server on ${PORT}`));
	})
	.catch((err) => {
		console.error("MongoDB connection failed:", err.message);
		process.exit(1);
	});

export default app;
