const Portfolio = require("../models/Portfolio");

exports.findByStudent = async (studentId) => {
  return Portfolio.findOne({ student: studentId }).populate("student projects");
};

exports.saveOrUpdate = async (data) => {
  const { student, projects, skills, badges, transcriptUrl } = data;
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
  return portfolio;
};

exports.remove = async (id) => {
  return Portfolio.findByIdAndDelete(id);
};
