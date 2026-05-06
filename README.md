# DITY Air Irrigation (MERN)

यह project एक MERN stack आधारित portal है जिसमें:

- Public वेबसाइट (Hindi by default + English toggle)
- Notice/Notification page
- Gallery image upload (Universal Admin से)
- Role based access: `UNIVERSAL_ADMIN`, `ADMIN`, `FARMER`
- Dynamic form management (Farmer/Dealer/Cancelled/Company/Vendor)
- Excel export API

## Folder Structure

- `Client` -> React + Vite + Tailwind CSS
- `Server` -> Express + MongoDB + JWT + Multer + XLSX

## Quick Start

1. Server env बनाएं:
   - `Server/.env.example` को copy करके `Server/.env` बनाएं
2. MongoDB चालू करें
3. Dependencies install करें (already done if this repo is fresh from this setup)
4. Universal admin seed करें:
   - `npm run server:seed`
5. Server चलाएं:
   - `npm run server:dev`
6. Client चलाएं:
   - `npm run client:dev`

## Default Login (Seed के बाद)

- Mobile: `9999999999`
- Password: `Admin@123`

## मुख्य API Endpoints

- `POST /api/auth/login`
- `GET /api/public`
- `POST /api/public/notice`
- `POST /api/public/gallery` (form-data: `image`)
- `POST /api/users`
- `GET /api/users`
- `POST /api/forms`
- `GET /api/forms`
- `GET /api/forms/export`

## Notes

- Hindi field names MongoDB में unicode keys के साथ save हो रहे हैं।
- Permissions user creation/update के समय dynamic रूप से set की जा सकती हैं।
- Excel export के लिए `forms/export` endpoint ready है।
