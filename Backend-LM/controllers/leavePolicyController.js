const fs = require('fs'); // Import Node's file system module
const leavePolicyService = require('../services/leavePolicyService');

const createPolicy = async (req, res) => {
	try {
		// Map incoming data to match the Prisma schema.
		const policyData = {
			policyName: req.body.name,
			policyCategory: req.body.type,
			documentUrl: req.file ? req.file.path : '/upload', // fallback path if file is missing
		};

		const policy = await leavePolicyService.createPolicy(policyData);
		res.status(201).json(policy);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getAllPolicies = async (req, res) => {
	try {
		const policies = await leavePolicyService.getAllPolicies();
		res.status(200).json(policies);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const getPolicyById = async (req, res) => {
	try {
		const { id } = req.params;
		const policy = await leavePolicyService.getPolicyById(id);
		if (!policy) {
			return res.status(404).json({ error: 'Policy not found' });
		}
		res.status(200).json(policy);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const deletePolicy = async (req, res) => {
	try {
		const { id } = req.params;
		// Fetch the policy to get its documentUrl.
		const policy = await leavePolicyService.getPolicyById(id);
		if (!policy) {
			return res.status(404).json({ error: 'Policy not found' });
		}
		// Check if a file was uploaded (avoid deleting default/fallback folder path)
		if (policy.documentUrl && policy.documentUrl !== '/upload') {
			try {
				// Using fs.promises for a promise-based approach.
				await fs.promises.unlink(policy.documentUrl);
			} catch (err) {
				console.error('Error deleting file:', err);
				// Optionally: decide if a file deletion error should prevent DB deletion.
			}
		}
		// Now delete the record from the database.
		await leavePolicyService.deletePolicy(id);
		res.status(204).send();
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	createPolicy,
	getAllPolicies,
	getPolicyById,
	deletePolicy,
};
