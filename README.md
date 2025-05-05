cd frontend
npm run dev
(corre en el puerto 127.0.0.1:5173)

cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
(corre en el puerto 127.0.0.1:8000)

En la EC2(LINUX)

FRONT:
cd frontend
sudo apt update
sudo apt install nodejs npm
npm install -g vite
npm install
node -v
npm -v
npm run dev o npm run build



BACK
# Actualiza el sistema y asegúrate de que Python 3 y venv estén instalados
sudo apt update
sudo apt install python3 python3-venv -y

# Crea el entorno virtual
python3 -m venv venv

# Activa el entorno virtual
source venv/bin/activate

# Instala las dependencias del proyecto (opcional)
pip install -r requirements.txt

uvicorn app.main:app --reload


sudo apt install nginx