const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const s3 = require("../config/s3Config");
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

// exports.getTrainingByyId = async (id) => {
//   return await prisma.training.findUnique({
//     where: { id },
//     include: {
//       trainer: true,
//       participants: true,
//       materialFiles: true,
//       lectureFiles: true,
//       resourceFiles: true,
//     },
//   });
// };

exports.getTrainingByyId = async (trainingId) => {
  return await prisma.training.findUnique({
    where: { id: trainingId },
    include: {
      trainer: true,
      participants: {
        include: {
          employee: true, // Ensures employee details are fetched
        },
      },
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
  console.log("Here is the log....", training);
  return {
    id: training.id,
    name: training.title,
    description: training.description,
    trainer: training.trainer?.name || "Unknown",
    mode: "Online",
    startDate: training.startDate,
    endDate: training.endDate,
    duration: `${training.duration} days`,
    sessionTiming: "Flexible",
    status: training.activeTraining ? "In Progress" : "Completed",
    progress: training.courseProgress,
    participants: training.participants.map((participant) => ({
      id: participant.employeeId,
      name: participant.name,
      department: participant.department || "N/A",
      email: participant.email,
      phone: participant.phone || "N/A",
      status: participant.status,
      progress: participant.progress,
      enrollmentDate: participant.enrollmentDate,
      trainingId: participant.trainingId,
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

async function uploadFileToS3(fileBuffer, fileName, mimeType) {
  const params = {
    Bucket: "galvinus-hr-portal",
    Key: `trainings/${Date.now()}-${fileName}`,
    Body: fileBuffer,
    ContentType: mimeType,
  };

  const uploadedFile = await s3.upload(params).promise();
  return uploadedFile.Location; // Return file URL
}

exports.createTraining = async (data, files) => {
  console.log(data);
  console.log("this is files", files);
  try {
    let trainerId = data.trainerId || null;

    if (trainerId) {
      let trainer = await prisma.trainer.findUnique({
        where: { id: trainerId },
      });
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

    // Upload files and store URLs
    const materialFiles = await Promise.all(
      (files?.materialFiles || []).map(async (file) => {
        const fileUrl = await uploadFileToS3(
          file.buffer,
          file.originalname,
          file.mimetype
        );
        return { title: file.originalname, type: file.mimetype, fileUrl };
      })
    );

    const lectureFiles = await Promise.all(
      (files?.lectureFiles || []).map(async (file) => {
        const videoUrl = await uploadFileToS3(
          file.buffer,
          file.originalname,
          file.mimetype
        );
        return {
          title: file.originalname,
          videoUrl,
          duration: 60,
          uploadedAt: new Date(),
        };
      })
    );

    const resourceFiles = await Promise.all(
      (files?.resourceFiles || []).map(async (file) => {
        const resourceUrl = await uploadFileToS3(
          file.buffer,
          file.originalname,
          file.mimetype
        );
        return {
          title: file.originalname,
          resourceUrl,
          uploadedAt: new Date(),
        };
      })
    );
    const trainingData = {
      title: data.title,
      description: data.description,
      trainerId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      courseProgress: parseFloat(data.courseProgress) || 0, // Convert to Float
      certificationAvailable: data.certificationAvailable === "true", // Convert to Boolean
      totalParticipants: parseInt(data.totalParticipants) || 0, // Convert to Int
      upcomingSessions: parseInt(data.upcomingSessions) || 0, // Convert to Int
      activeTraining: data.activeTraining === "true", // Convert to Boolean

      // Include uploaded files if they exist
      materialFiles: materialFiles.length
        ? { create: materialFiles }
        : undefined,
      lectureFiles: lectureFiles.length ? { create: lectureFiles } : undefined,
      resourceFiles: resourceFiles.length
        ? { create: resourceFiles }
        : undefined,
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

// exports.updateTraining = async (id, data, files) => {
//   try {
//     // console.log("Updating training ID:", id);
//     // console.log("Received Data:", JSON.stringify(data, null, 2));
//     // console.log("Received Files:", JSON.stringify(files, null, 2));

//     if (!data || typeof data !== "object") {
//       throw new Error("Invalid data format: Expected an object");
//     }

//     // Verify training exists
//     const existingTraining = await prisma.training.findUnique({
//       where: { id },
//       include: { materialFiles: true, lectureFiles: true, resourceFiles: true },
//     });

//     if (!existingTraining) {
//       throw new Error(`Training with ID ${id} not found`);
//     }

//     // Convert values to correct types
//     const parseBoolean = (value) => value === "true";
//     const parseNumber = (value, fallback) => (isNaN(value) ? fallback : Number(value));

//     data.courseProgress = "courseProgress" in data ? parseNumber(data.courseProgress, existingTraining.courseProgress) : existingTraining.courseProgress;
//     data.certificationAvailable = "certificationAvailable" in data ? parseBoolean(data.certificationAvailable) : existingTraining.certificationAvailable;
//     data.totalParticipants = "totalParticipants" in data ? parseNumber(data.totalParticipants, existingTraining.totalParticipants) : existingTraining.totalParticipants;
//     data.upcomingSessions = "upcomingSessions" in data ? parseNumber(data.upcomingSessions, existingTraining.upcomingSessions) : existingTraining.upcomingSessions;
//     data.activeTraining = "activeTraining" in data ? parseBoolean(data.activeTraining) : existingTraining.activeTraining;
//     data.startDate = data.startDate ? new Date(data.startDate) : existingTraining.startDate;
//     data.endDate = data.endDate ? new Date(data.endDate) : existingTraining.endDate;
//     data.trainerId = data.trainerId || null;

//     console.log("Uploading files...");

//     // Safe file upload function
//     const safeUploadFileToS3 = async (file) => {
//       try {
//         return await uploadFileToS3(file.buffer, file.originalname, file.mimetype);
//       } catch (error) {
//         console.error(`Failed to upload ${file.originalname}:`, error);
//         return null;
//       }
//     };

//     // Upload new files
//     const processFiles = async (fileGroup, type) => {
//       return fileGroup?.length
//         ? (await Promise.all(fileGroup.map(safeUploadFileToS3))).filter(Boolean).map((url, i) => ({
//             title: fileGroup[i].originalname,
//             [`${type}Url`]: url,
//             uploadedAt: new Date(),
//             trainingId: id,
//           }))
//         : [];
//     };

//     const newMaterialFiles = await processFiles(files?.materialFiles, "file");
//     const newLectureFiles = await processFiles(files?.lectureFiles, "video");
//     const newResourceFiles = await processFiles(files?.resourceFiles, "resource");

//     console.log("Updating training record...");

//     const updateData = {
//       title: data.title || existingTraining.title,
//       description: data.description || existingTraining.description,
//       trainer: data.trainerId ? { connect: { id: data.trainerId } } : undefined,
//       courseProgress: data.courseProgress,
//       certificationAvailable: data.certificationAvailable,
//       totalParticipants: data.totalParticipants,
//       upcomingSessions: data.upcomingSessions,
//       activeTraining: data.activeTraining,
//       startDate: data.startDate,
//       endDate: data.endDate,

//       materialFiles: newMaterialFiles.length ? { create: newMaterialFiles } : undefined,
//       lectureFiles: newLectureFiles.length ? { create: newLectureFiles } : undefined,
//       resourceFiles: newResourceFiles.length ? { create: newResourceFiles } : undefined,
//     };

//     Object.keys(updateData).forEach((key) => {
//       if (updateData[key] === undefined) delete updateData[key];
//     });

//     await prisma.training.update({ where: { id }, data: updateData });

//     console.log("Fetching updated training...");

//     return await prisma.training.findUnique({
//       where: { id },
//       include: { trainer: true, participants: { include: { employee: true } }, sessions: true, materialFiles: true, lectureFiles: true, resourceFiles: true },
//     });
//   } catch (error) {
//     console.error("Error in updateTraining:", error);
//     throw error;
//   }
// };

exports.updateTraining = async (id, data, files) => {
  try {
    if (!data || typeof data !== "object") {
      throw new Error("Invalid data format: Expected an object");
    }

    // Fetch existing training
    const existingTraining = await prisma.training.findUnique({
      where: { id },
      include: { materialFiles: true, lectureFiles: true, resourceFiles: true },
    });

    if (!existingTraining) {
      throw new Error(`Training with ID ${id} not found`);
    }

    // Safe Type Conversion
    const parseBoolean = (value) => value === "true";
    const parseNumber = (value, fallback) =>
      isNaN(value) ? fallback : Number(value);
    const parseDate = (value, fallback) =>
      isNaN(Date.parse(value)) ? fallback : new Date(value);

    data.courseProgress =
      "courseProgress" in data
        ? parseNumber(data.courseProgress, existingTraining.courseProgress)
        : existingTraining.courseProgress;
    data.certificationAvailable =
      "certificationAvailable" in data
        ? parseBoolean(data.certificationAvailable)
        : existingTraining.certificationAvailable;
    data.totalParticipants =
      "totalParticipants" in data
        ? parseNumber(data.totalParticipants, existingTraining.totalParticipants)
        : existingTraining.totalParticipants;
    data.upcomingSessions =
      "upcomingSessions" in data
        ? parseNumber(data.upcomingSessions, existingTraining.upcomingSessions)
        : existingTraining.upcomingSessions;
    data.activeTraining =
      "activeTraining" in data
        ? parseBoolean(data.activeTraining)
        : existingTraining.activeTraining;
    data.startDate = data.startDate
      ? parseDate(data.startDate, existingTraining.startDate)
      : existingTraining.startDate;
    data.endDate = data.endDate
      ? parseDate(data.endDate, existingTraining.endDate)
      : existingTraining.endDate;

    console.log("Uploading files...");

    const safeUploadFileToS3 = async (file) => {
      try {
        return await uploadFileToS3(
          file.buffer,
          file.originalname,
          file.mimetype
        );
      } catch (error) {
        console.error(`Failed to upload ${file.originalname}:`, error);
        return null;
      }
    };

    const processFiles = async (fileGroup, type) => {
      return fileGroup?.length
        ? (await Promise.all(fileGroup.map(safeUploadFileToS3)))
            .filter(Boolean)
            .map((url, i) => ({
              title: fileGroup[i].originalname,
              [`${type}Url`]: url,
              uploadedAt: new Date(), // ✅ Added `uploadedAt`
              // trainingId: id,
            }))
        : [];
    };

    // Ensure `files` is valid
    const newMaterialFiles = files?.materialFiles
      ? await processFiles(files.materialFiles, "file")
      : [];
    const newLectureFiles = files?.lectureFiles
      ? await processFiles(files.lectureFiles, "video")
      : [];
    const newResourceFiles = files?.resourceFiles
      ? await processFiles(files.resourceFiles, "resource")
      : [];

    console.log("Updating training record...");

    const updateData = {
      title: data.title || existingTraining.title,
      description: data.description || existingTraining.description,
      trainer: data.trainerId ? { connect: { id: data.trainerId } } : undefined, // ✅ Fixed `trainer` relation
      courseProgress: data.courseProgress,
      certificationAvailable: data.certificationAvailable,
      totalParticipants: data.totalParticipants,
      upcomingSessions: data.upcomingSessions,
      activeTraining: data.activeTraining,
      startDate: data.startDate,
      endDate: data.endDate,

      materialFiles: newMaterialFiles.length
        ? { create: newMaterialFiles.map((file) => ({ ...file,  type: "RESOURCE"})) }
        : undefined,

      lectureFiles: newLectureFiles.length
        ? { create: newLectureFiles.map((file) => ({ ...file,  duration: 0 })) } // ✅ Added `duration`
        : undefined,

      resourceFiles: newResourceFiles.length
        ? { create: newResourceFiles.map((file) => ({ ...file })) }
        : undefined,
    };

    console.log("This is updated data:", updateData);

    await prisma.training.update({ where: { id }, data: updateData });

    console.log("Fetching updated training...");

    return await prisma.training.findUnique({
      where: { id },
      include: { trainer: true, participants: { include: { employee: true } }, sessions: true, materialFiles: true, lectureFiles: true, resourceFiles: true },
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
