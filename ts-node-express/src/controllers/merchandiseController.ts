import { Request, Response } from 'express';
import { Merchandise } from '../types/types';
import * as fs from 'fs';

const dataPath = 'data/merchandise.json';
const writeData = (data: Merchandise[]): void => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
};
// Helper function to read data from JSON file
const readData = (): Merchandise[] => {
    return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
};

// Get all merchandise
export const getMerchandise = (req: Request, res: Response) => {
    try {
        const merchandise = readData();
        res.status(200).json(merchandise);
    } catch (error) {
        res.status(500).send('Error retrieving merchandise');
    }
};

// Create new merchandise
export const createMerchandise = (req: Request, res: Response) => {
    try {
        const { name, price } = req.body;
        const merchandise = readData();
        const newMerchandise: Merchandise = {
            id: merchandise.length + 1, // Simple ID assignment, consider a more robust approach
            name,
            price,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        merchandise.push(newMerchandise);
        writeData(merchandise);
        res.status(201).json(newMerchandise);
    } catch (error) {
        res.status(500).send('Error creating merchandise');
    }
};

// Update merchandise
export const updateMerchandise = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, price } = req.body;
        const merchandise = readData();
        const itemIndex = merchandise.findIndex(item => item.id === parseInt(id));

        if (itemIndex === -1) {
            return res.status(404).send('Merchandise not found');
        }

        merchandise[itemIndex] = {
            ...merchandise[itemIndex],
            name,
            price,
            updatedAt: new Date().toISOString()
        };

        writeData(merchandise);
        res.status(200).json(merchandise[itemIndex]);
    } catch (error) {
        res.status(500).send('Error updating merchandise');
    }
};

// Delete merchandise
export const deleteMerchandise = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let merchandise = readData();
        const itemIndex = merchandise.findIndex(item => item.id === parseInt(id));

        if (itemIndex === -1) {
            return res.status(404).send('Merchandise not found');
        }

        merchandise = merchandise.filter(item => item.id !== parseInt(id));
        writeData(merchandise);
        res.status(200).send(`Deleted merchandise with id ${id}`);
    } catch (error) {
        res.status(500).send('Error deleting merchandise');
    }
};
