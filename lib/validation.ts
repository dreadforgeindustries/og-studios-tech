import { z } from 'zod';

const email = z.string().trim().email('Enter a valid email address.').max(160);
const text = (name:string,max=5000)=>z.string().trim().min(1,`${name} is required.`).max(max,`${name} is too long.`);

export const contactSchema = z.object({ name:text('Name',120), email, phone:z.string().trim().max(30).optional().or(z.literal('')), message:text('Message',3000), website:z.string().optional() });
export const registrationSchema = z.object({ name:text('Name',120), email, phone:text('Phone / WhatsApp',30), workshop_id:z.string().uuid('Select a valid workshop.'), education_level:text('Education level',120), message:z.string().trim().max(2000).optional().or(z.literal('')), website:z.string().optional() });
export const enquirySchema = z.object({ type:text('Project type',80), project_name:text('Project name',160), description:text('Description',5000), features:text('Main features',5000), technology:text('Technology preference',500), timeline:text('Timeline',80), name:text('Name',120), email, whatsapp:text('WhatsApp',30), website:z.string().optional() });
