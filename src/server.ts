import app from "./app"
const port = process.env.PORT || 3000;
const mode = process.env.MODE 
app.listen(port, () => {
    console.log(`Server running on port ${port} in ${mode}`);
})