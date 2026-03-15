const faqRepository = require("../repositories/faq.repository");

function response(error, data, message) {
  return { error, data, message };
}

exports.create = async (data) => {
  try {
    const faq = await faqRepository.create(data);
    return response(false, faq, "FAQ created");
  } catch (err) {
    return response(true, null, err.message || "Failed to create FAQ");
  }
};

exports.getAll = async () => {
  try {
    const faqs = await faqRepository.findAll();
    return response(false, faqs, "FAQs fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch FAQs");
  }
};

exports.getById = async (id) => {
  try {
    const faq = await faqRepository.findById(id);
    if (!faq) return response(true, null, "FAQ not found");
    return response(false, faq, "FAQ fetched");
  } catch (err) {
    return response(true, null, err.message || "Failed to fetch FAQ");
  }
};

exports.update = async (id, data) => {
  try {
    const faq = await faqRepository.update(id, data);
    if (!faq) return response(true, null, "FAQ not found");
    return response(false, faq, "FAQ updated");
  } catch (err) {
    return response(true, null, err.message || "Failed to update FAQ");
  }
};

exports.remove = async (id) => {
  try {
    const faq = await faqRepository.remove(id);
    if (!faq) return response(true, null, "FAQ not found");
    return response(false, null, "FAQ deleted");
  } catch (err) {
    return response(true, null, err.message || "Failed to delete FAQ");
  }
};
