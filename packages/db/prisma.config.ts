import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    schema: 'prisma/schema.prisma',
    datasource: {
        provider: 'postgresql',
        url: process.env.DIRECT_URL, 
    },
});