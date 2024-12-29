const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); 


mongoose.connect('mongodb://localhost:27017/newsdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));


const newsSchema = new mongoose.Schema({
    title: String,
    content: String
});


const News = mongoose.model('News', newsSchema);
app.get('/api/news', async (req, res) => {
    try {
        const newsData = await News.find();
        res.json(newsData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/news', async (req, res) => {
    const newArticle = new News({
        title: req.body.title,
        content: req.body.content
    });

    try {
        const savedArticle = await newArticle.save();
        res.status(201).json(savedArticle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put('/api/news/:id', async (req, res) => {
    try {
        const updatedArticle = await News.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            content: req.body.content
        }, { new: true }); 

        if (!updatedArticle) {
            return res.status(404).json({ message: 'News article not found' });
        }

        res.json(updatedArticle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
app.delete('/api/news/:id', async (req, res) => {
    try {
        const deletedArticle = await News.findByIdAndDelete(req.params.id);

        if (!deletedArticle) {
            return res.status(404).json({ message: 'News article not found' });
        }

        res.json({ message: 'News article deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));