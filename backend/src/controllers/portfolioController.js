const Portfolio = require("../models/Portfolio");

// Get portfolio by student
exports.getPortfolioByStudent = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      student: req.params.studentId,
    }).populate("student projects");
    if (!portfolio)
      return res.status(404).json({ message: "Portfolio not found" });
    res.json(portfolio);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch portfolio", error: err.message });
  }
};

// Create or update portfolio
exports.savePortfolio = async (req, res) => {
  try {
    const { student, projects, skills, badges, transcriptUrl } = req.body;
    let portfolio = await Portfolio.findOne({ student });
    if (portfolio) {
      portfolio.projects = projects;
      portfolio.skills = skills;
      portfolio.badges = badges;
      portfolio.transcriptUrl = transcriptUrl;
      await portfolio.save();
    } else {
      portfolio = new Portfolio({
        student,
        projects,
        skills,
        badges,
        transcriptUrl,
      });
      await portfolio.save();
    }
    res.status(201).json(portfolio);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to save portfolio", error: err.message });
  }
};
