// import {
//   ServerResponseError,
//   ServerResponseSuccess,
// } from "@interfaces/ServerResponse.types";

// interface IGenerateResponseInputs {
//   status: boolean;
//   payload: any;
// }

// export const generateResponse = ({
//   status,
//   payload,
// }: IGenerateResponseInputs): ServerResponseSuccess | ServerResponseError => {
//   if (status === true) {
//     return {
//       error: false,
//       data: payload,
//     };
//   } else {
//     return {
//       error: true,
//       message: payload,
//     };
//   }
// };
