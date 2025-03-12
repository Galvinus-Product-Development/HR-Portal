const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllPolicies = async () => {
	return await prisma.leavePolicy.findMany();
};

const getPolicyById = async (id) => {
	return await prisma.leavePolicy.findUnique({ where: { id } });
};

const createPolicy = async (policyData) => {
	return await prisma.leavePolicy.create({ data: policyData });
};

const deletePolicy = async (id) => {
	return await prisma.leavePolicy.delete({ where: { id } });
};

module.exports = {
	getAllPolicies,
	getPolicyById,
	createPolicy,
	deletePolicy,
};
