// FileUtils.js
// import RNFS from "react-native-fs";

// export const createFileIfNotExists = async (filePath) => {
//   try {
//     const fileExists = await RNFS.exists(filePath);
//     if (!fileExists) {
//       await RNFS.writeFile(filePath, "", "utf8");
//       // console.log("File created successfully!");
//     }
//   } catch (error) {
//     // console.log("Error creating file:", error);
//   }
// };

// export const addDataToFile = async (filePath, data) => {
//   try {
//     await RNFS.appendFile(filePath, data, "utf8");
//   } catch (error) {
//     // console.log("Error adding data to file:", error);
//   }
// };

// export const deleteDataFromFile = async (filePath) => {
//   try {
//     RNFS.unlink(filePath)
//       .then(() => {
//         // console.log("File data removed successfully.");
//       })
//       .catch((error) => {
//         // console.log("Error while removing file data:", error);
//       });
//   } catch (error) {
//     // console.log("Error while removing the data", error);
//   }
// };
