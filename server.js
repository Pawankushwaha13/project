
// server.js - Serves static landing pages and provides simple APIs
const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple in-memory storage for leads (for local testing)
const leads = [];

// Sample universities data (nested JSON)
const universities = [
  {
    id: "uni-1",
    name: "Greenfield Private University",
    overview: "A modern university focused on technology and design.",
    courses: [
      { code: "BTECH-CS", name: "B.Tech Computer Science", fee_min: 60000, fee_max: 150000, duration: "4 years" },
      { code: "BBA", name: "BBA", fee_min: 50000, fee_max: 90000, duration: "3 years" }
    ],
    placements: { top_companies: ["TCS", "Infosys", "Google (interns)"], avg_package: "6 LPA" },
    facilities: ["Hostel", "Labs", "Sports complex"]
  },
  {
    id: "uni-2",
    name: "Riverside Institute of Management",
    overview: "Focused on business and entrepreneurship.",
    courses: [
      { code: "MBA", name: "MBA (Full Time)", fee_min: 200000, fee_max: 600000, duration: "2 years" },
      { code: "BBA", name: "BBA", fee_min: 60000, fee_max: 120000, duration: "3 years" }
    ],
    placements: { top_companies: ["Accenture", "Deloitte"], avg_package: "8 LPA" },
    facilities: ["Library", "Industry labs", "Mentorship"]
  }
];

app.get('/api/universities', (req, res) => {
  res.json(universities);
});

app.get('/api/universities/:id', (req, res) => {
  const uni = universities.find(u => u.id === req.params.id);
  if (!uni) return res.status(404).json({ error: "Not found" });
  res.json(uni);
});

// POST lead: will forward to PIPEDREAM_ENDPOINT if set in .env, otherwise store locally
app.post('/api/leads', async (req, res) => {
  const lead = req.body;
  lead.receivedAt = new Date().toISOString();
  // Basic validation
  if (!lead.fullName || !lead.email || !lead.phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  // store locally
  leads.push(lead);

  const pd = process.env.PIPEDREAM_ENDPOINT || "";
  if (pd) {
    try {
      const resp = await fetch(pd, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      });
      return res.json({ ok: true, forwarded: true, pdStatus: resp.status });
    } catch (e) {
      return res.json({ ok: true, forwarded: false, error: e.message });
    }
  } else {
    // no pipedream - respond success and show that it's stored locally
    return res.json({ ok: true, forwarded: false, localStore: true });
  }
});

// Endpoint to view stored leads (for reviewer/testing)
app.get('/api/leads', (req, res) => {
  res.json(leads);
});

// Serve index at root with links to both landing pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log('Server running on port', PORT));
