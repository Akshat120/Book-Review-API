import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import { createUser, findUserByUsername } from '../repositories/userRepository.js';

dotenv.config();

// homePage
export function homePage (_req, res) {
    res.status(200).json({
      msg: "Welcome to Book Review API",
    });
}

// signup
export async function signup (req, res) {
    const { name, username, password } = req.body;
    
    const validation = validateFields({name,username,password})
    if (!validation.isValid) {
        return res.status(400).json({ error: validation.error });
    }
    
    try {
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
          return res.status(409).json({ error: 'Username already registered.' });
        }
    
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS));
        await createUser({ name, username, hashedPassword });
        
        return res.status(201).json({ message: 'User created successfully' });

      } catch (err) {
        console.error('Signup error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// login
export async function login(req, res) {
    const { username, password } = req.body;
    const validation = validateFields({name: "dummy", username, password});
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }
  
    try {
      const user = await findUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
  
      const token = setAuthCookie(res, user);
  
      return res.json({
        message: 'Login successful',
        user: { username: user.username, name: user.name },
      });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

function setAuthCookie(res, user) {
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  
    res.cookie('jwt', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Strict', 
      maxAge: 60 * 60 * 1000,
    });
  
    return token;
}

function validateFields({ name, username, password }) {
    if (!name || !username || !password) {
        return { isValid: false, error: 'All fields are required.' };
    }

    if (/\s/.test(username)) {
        return { isValid: false, error: 'Username cannot contain spaces.' };
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        return {
        isValid: false,
        error: 'Password must be at least 8 characters long and include an uppercase letter and a number.',
        };
    }
    
    return { isValid: true };
}