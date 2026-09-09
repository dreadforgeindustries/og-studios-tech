import { z } from 'zod';

const email = z.string().trim().email('Enter a valid email address.').max(160);
const text = (name: string, max = 5000) => z.string().trim().min(1, `${name} is required.`).max(max, `${name} is too long.`);
const url = z.string().trim().url('Enter a valid URL.').max(500).optional().or(z.literal(''));

export const contactSchema = z.object({ name: text('Name', 120), email, phone: z.string().trim().max(30).optional().or(z.literal('')), message: text('Message', 3000), website: z.string().optional() });
export const registrationSchema = z.object({ name: text('Name', 120), email, phone: text('Phone / WhatsApp', 30), workshop_id: z.string().uuid('Select a valid workshop.'), education_level: text('Education level', 120), message: z.string().trim().max(2000).optional().or(z.literal('')), website: z.string().optional() });
export const enquirySchema = z.object({ type: text('Project type', 80), project_name: text('Project name', 160), description: text('Description', 5000), features: text('Main features', 5000), technology: z.string().trim().max(500).optional().or(z.literal('')), timeline: text('Timeline', 80), name: text('Name', 120), email, whatsapp: text('WhatsApp', 30), website: z.string().optional() });

const status = z.enum(['draft', 'published']);
const concept = z.boolean();
const stringArray = z.array(z.string().trim().min(1).max(300)).max(100);
export const projectAdminSchema = z.object({ title: text('Title', 160), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must use lowercase letters, numbers and hyphens.').max(180), category: text('Category', 100), description: text('Description', 5000), overview: z.string().trim().max(10000).optional().or(z.literal('')), problem: z.string().trim().max(10000).optional().or(z.literal('')), solution: z.string().trim().max(10000).optional().or(z.literal('')), architecture: z.string().trim().max(10000).optional().or(z.literal('')), challenges: z.string().trim().max(10000).optional().or(z.literal('')), outcome: z.string().trim().max(10000).optional().or(z.literal('')), technologies: stringArray.default([]), features: stringArray.default([]), images: z.array(z.string().url().max(1000)).max(20).default([]), demo_url: url, github_url: url, featured: z.boolean().default(false), is_concept: concept.default(true), status: status.default('draft') });
export const workshopAdminSchema = z.object({ title: text('Title', 160), description: text('Description', 5000), topics: stringArray.default([]), level: text('Level', 80), date: z.string().datetime().nullable().optional(), duration: text('Duration', 80), seats: z.number().int().min(1).max(10000), registered_count: z.number().int().min(0).max(10000).default(0), status: z.enum(['Draft', 'Open', 'Closed', 'Cancelled']).default('Draft') });
export const enquiryStatusSchema = z.enum(['New', 'Contacted', 'In Discussion', 'In Progress', 'Completed', 'Archived']);
export const settingsSchema = z.record(z.string().trim().min(1).max(80), z.string().trim().max(2000));
