# DineReview

DineReview is a full-stack restaurant review platform where users can discover restaurants, view reviews, and rate restaurants.

Users can register as either **Reviewers** or **Restaurant Owners**, with different permissions based on their role.

## Features

- User registration and JWT authentication
- Reviewer and Restaurant Owner roles
- Restaurant CRUD for owners
- Owner-based access control
- Restaurant filtering by city, cuisine, and rating
- Pagination and infinite scrolling
- Restaurant reviews and ratings
- One review per reviewer per restaurant
- API validation and automated backend tests

## Tech Stack

### Frontend

- React
- React Router
- Tailwind CSS
- Axios

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication
- Pytest

### Database

- PostgreSQL
- Supabase

## Running Locally

### Backend

Create and activate a virtual environment:

```bash
python -m venv backendvenv
```

Windows:

```powershell
.\backendvenv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `backend/.env`:

```env
DATABASE_URL=your_database_connection_string
JWT_SECRET_KEY=your_jwt_secret
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend

Install dependencies:

```bash
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## Testing

Run backend tests:

```bash
cd backend
pytest -v
```
