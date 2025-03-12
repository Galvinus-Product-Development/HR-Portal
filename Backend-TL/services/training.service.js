const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllTrainings = async () => {
  try {
    return await prisma.training.findMany({
      include: {
        trainer: true,
        participants: { include: { employee: true } },
        sessions: true,
        materialFiles: true,
        lectureFiles: true,
        resourceFiles: true,
      },
    });
  } catch (error) {
    console.error("Error in getAllTrainings:", error);
    throw error;
  }
};

exports.getTrainingByyId = async (id) => {
  return await prisma.training.findUnique({
    where: { id },
    include: {
      trainer: true,
      participants: true,
      materialFiles: true,
      lectureFiles: true,
      resourceFiles: true,
    },
  });
};

exports.getTrainingById = async (trainingId) => {
  const training = await prisma.training.findUnique({
    where: { id: trainingId },
    include: {
      trainer: true,
      participants: true,
      materialFiles: true,
      lectureFiles: true,
      resourceFiles: true,
    },
  });

  if (!training) return null;

  return {
    id: training.id,
    name: training.title,
    description: training.description,
    trainer: training.trainer?.name || "Unknown",
    mode: "Online",
    startDate: "2024-03-15",
    endDate: "2024-04-15",
    duration: `${training.duration} days`,
    sessionTiming: "Flexible",
    status: training.activeTraining ? "In Progress" : "Completed",
    progress: training.courseProgress,
    participants: training.participants.map((participant) => ({
      id: participant.id,
      name: participant.name,
      department: participant.department || "N/A",
      email: participant.email,
      phone: participant.phone || "N/A",
    })),
    resources: [
      ...training.lectureFiles.map((lecture) => ({
        id: lecture.id,
        name: lecture.title,
        type: "video",
        url: lecture.videoUrl,
        completed: false,
      })),
      ...training.materialFiles.map((material) => ({
        id: material.id,
        name: material.title,
        type: "document",
        url: material.fileUrl,
        completed: false,
      })),
      ...training.resourceFiles.map((resource) => ({
        id: resource.id,
        name: resource.title,
        type: "meeting",
        url: resource.resourceUrl,
        completed: false,
      })),
    ],
  };
};

exports.createTraining = async (data) => {
  console.log(data);
  try {
    let trainerId = data.trainerId || null;

    // If trainerId is provided, check if trainer exists
    if (trainerId) {
      let trainer = await prisma.trainer.findUnique({
        where: { id: trainerId },
      });

      // If trainer does not exist, create a new one
      if (!trainer) {
        trainer = await prisma.trainer.create({
          data: {
            id: trainerId,
            name: data.trainerName || "Unknown Trainer",
            email: data.trainerEmail || `trainer@${trainerId}example.com`,
            phone: data.trainerPhone || "0000000000",
            expertise: data.trainerExpertise || "Unknown",
          },
        });
        trainerId = trainer.id;
      }
    }

    // Dummy file URLs for now
    const dummyFileUrl = "https://example.com/dummy-file.pdf";

    // Prepare training data with dummy file URLs
    const trainingData = {
      title: data.title,
      description: data.description,
      trainerId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      courseProgress: data.courseProgress,
      certificationAvailable: data.certificationAvailable,
      totalParticipants: data.totalParticipants,
      upcomingSessions: data.upcomingSessions,
      activeTraining: data.activeTraining,
      materialFiles: {
        create: (data.materialFiles || []).map(() => ({
          title: "Dummy Material",
          type: "PDF",
          fileUrl: dummyFileUrl,
        })),
      },
      lectureFiles: {
        create: (data.lectureFiles || []).map(() => ({
          title: "Dummy Lecture",
          videoUrl: dummyFileUrl,
          duration: 60, // Dummy duration in minutes
          uploadedAt: new Date(),
        })),
      },
      resourceFiles: {
        create: (data.resourceFiles || []).map(() => ({
          title: "Dummy Resource",
          resourceUrl: dummyFileUrl,
          uploadedAt: new Date(),
        })),
      },
    };

    return await prisma.training.create({
      data: trainingData,
      include: {
        trainer: true,
        participants: { include: { employee: true } },
        sessions: true,
        materialFiles: true,
        lectureFiles: true,
        resourceFiles: true,
      },
    });
  } catch (error) {
    console.error("Error in createTraining:", error);
    throw error;
  }
};

exports.updateTraining = async (id, data) => {
  try {
    const { id: _, ...updateData } = data;
    console.log("This is user Id", id);
    console.log("This is updated data", updateData);
    // Verify training exists
    const existingTraining = await prisma.training.findUnique({
      where: { id },
    });

    if (!existingTraining) {
      throw new Error(`Training with ID ${id} not found`);
    }

    // Handle trainer updates
    if (updateData.hasOwnProperty("trainerId")) {
      if (updateData.trainerId) {
        // Verify new trainer exists if trainerId is provided
        const trainer = await prisma.trainer.findUnique({
          where: { id: updateData.trainerId },
        });
        if (!trainer) {
          throw new Error(`Trainer with ID ${updateData.trainerId} not found`);
        }
      } else {
        // If trainerId is null or undefined, explicitly set it to null
        updateData.trainerId = null;
      }
    }

    return await prisma.training.update({
      where: {
        id,
      },
      data: {
        title: updateData.title,
        description: updateData.description,
        trainer: {
          connect: { id: updateData.trainerId },
        }, // ✅ Fixed trainerId
        // duration: isNaN(parseInt(duration)) ? null : `${duration} weeks`, // ✅ Ensure valid duration
        courseProgress: 55,
        certificationAvailable: false,
        totalParticipants: 1,
        upcomingSessions: 0,
        activeTraining: true,
        startDate: new Date(updateData.startDate), // ✅ Example start date
        endDate: new Date(updateData.endDate), // ✅ Example end date
      },
      include: {
        trainer: true,
        participants: { include: { employee: true } },
        sessions: true,
        materialFiles: true,
        lectureFiles: true,
        resourceFiles: true,
      },
    });
  } catch (error) {
    console.error("Error in updateTraining:", error);
    throw error;
  }
};

exports.deleteTraining = async (id) => {
  try {
    // Check if training exists
    const training = await prisma.training.findUnique({
      where: { id },
      include: {
        materialFiles: true,
        lectureFiles: true,
        resourceFiles: true,
        sessions: true,
        participants: true,
      },
    });

    if (!training) {
      throw new Error(`Training with ID ${id} not found`);
    }

    // Delete related records
    await prisma.courseMaterial.deleteMany({ where: { trainingId: id } });
    await prisma.videoLecture.deleteMany({ where: { trainingId: id } });
    await prisma.additionalResource.deleteMany({ where: { trainingId: id } });
    await prisma.session.deleteMany({ where: { trainingId: id } });
    await prisma.participant.deleteMany({ where: { trainingId: id } });

    // Now delete the training
    return await prisma.training.delete({ where: { id } });
  } catch (error) {
    console.error("Error in deleteTraining:", error);
    throw error;
  }
};

exports.fetchFormattedTrainings = async () => {
  try {
    const trainings = await prisma.training.findMany({
      include: {
        trainer: true,
        participants: { include: { employee: true } },
        sessions: true,
        materialFiles: true,
        lectureFiles: true,
        resourceFiles: true,
      },
    });

    const summary = {
      activeTrainings: trainings.filter((t) => t.activeTraining).length,
      completedTrainings: trainings.filter((t) => t.courseProgress === 100)
        .length,
      totalParticipants: trainings.reduce(
        (sum, t) => sum + t.totalParticipants,
        0
      ),
      upcomingSessions: trainings.reduce(
        (sum, t) => sum + t.upcomingSessions,
        0
      ),
    };
    console.log("hhhhhhhhhhhhhhhh.........", trainings);
    const formattedTrainings = trainings.map((training) => ({
      id: training.id,
      title: training.title,
      description: training.description,
      trainer: training?.trainer
        ? {
            id: training.trainer.id,
            name: training.trainer.name,
            expertise: training.trainer.expertise || "Not Provided",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              training.trainer.name
            )}`,
          }
        : {
            id: "N/A",
            name: "Unknown Trainer",
            expertise: "Not Provided",
            avatar: `https://ui-avatars.com/api/?name=Unknown+Trainer`,
          },
      startDate: training.startDate?.toISOString().split("T")[0] || "N/A",
      endDate: training.endDate?.toISOString().split("T")[0] || "N/A",
      duration: `${training.duration} weeks`,
      status:
        training.courseProgress === 100
          ? "Completed"
          : training.activeTraining
          ? "In Progress"
          : "Upcoming",
      participants: training.participants.map((p) => ({
        id: p.employee?.id,
        name: p.employee?.name,
        department: p.employee?.department,
        email: p.employee?.email,
      })),
      progress: Math.floor(training.courseProgress),
      resources: [
        ...(training.materialFiles || []).map((r) => ({
          title: r.title,
          url: r.fileUrl,
          type: "pdf",
        })),
        ...(training.lectureFiles || []).map((r) => ({
          title: r.title,
          url: r.videoUrl,
          type: "video",
        })),
        ...(training.resourceFiles || []).map((r) => ({
          title: r.title,
          url: r.resourceUrl,
          type: "link",
        })),
      ],
      certificationAvailable: training.certificationAvailable,
    }));

    return { summary, trainings: formattedTrainings };
  } catch (error) {
    console.error("Error in fetchFormattedTrainings:", error);
    throw error;
  }
};
