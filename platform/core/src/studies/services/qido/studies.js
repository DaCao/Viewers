import { api } from 'dicomweb-client';
import DICOMWeb from '../../../DICOMWeb/';

import errorHandler from '../../../errorHandler';

/**
 * Creates a QIDO date string for a date range query
 * Assumes the year is positive, at most 4 digits long.
 *
 * @param date The Date object to be formatted
 * @returns {string} The formatted date string
 */
function dateToString(date) {
  if (!date) return '';
  let year = date.getFullYear().toString();
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();
  year = '0'.repeat(4 - year.length).concat(year);
  month = '0'.repeat(2 - month.length).concat(month);
  day = '0'.repeat(2 - day.length).concat(day);
  return ''.concat(year, month, day);
}

/**
 * Produces a QIDO URL given server details and a set of specified search filter
 * items
 *
 * @param filter
 * @param serverSupportsQIDOIncludeField
 * @returns {string} The URL with encoded filter query data
 */
function getQIDOQueryParams(filter, serverSupportsQIDOIncludeField) {
  const commaSeparatedFields = [
    '00081030', // Study Description
    '00080060', // Modality
    // Add more fields here if you want them in the result
  ].join(',');

  const parameters = {
    PatientName: filter.PatientName,
    PatientID: filter.PatientID,
    AccessionNumber: filter.AccessionNumber,
    StudyDescription: filter.StudyDescription,
    ModalitiesInStudy: filter.ModalitiesInStudy,
    limit: filter.limit,
    offset: filter.offset,
    fuzzymatching: filter.fuzzymatching,
    includefield: serverSupportsQIDOIncludeField ? commaSeparatedFields : 'all',
  };

  // build the StudyDate range parameter
  if (filter.studyDateFrom || filter.studyDateTo) {
    const dateFrom = dateToString(new Date(filter.studyDateFrom));
    const dateTo = dateToString(new Date(filter.studyDateTo));
    parameters.StudyDate = `${dateFrom}-${dateTo}`;
  }

  // Build the StudyInstanceUID parameter
  if (filter.StudyInstanceUID) {
    let studyUIDs = filter.StudyInstanceUID;
    studyUIDs = Array.isArray(studyUIDs) ? studyUIDs.join() : studyUIDs;
    studyUIDs = studyUIDs.replace(/[^0-9.]+/g, '\\');
    parameters.StudyInstanceUID = studyUIDs;
  }

  // Clean query params of undefined values.
  const params = {};
  Object.keys(parameters).forEach(key => {
    if (parameters[key] !== undefined && parameters[key] !== '') {
      params[key] = parameters[key];
    }
  });

  return params;
}

export default function Studies(server, filter) {

  const studies = [];

  studies.push({
    StudyInstanceUID: "1.2.840.113619.2.5.1762583153.215519.978957063.78",
    StudyDate: "20200108",
    StudyTime: "120022",
    AccessionNumber: "001",
    PatientName: "Alice",
    PatientID: "000001",
    PatientBirthdate: "19880101",
    patientSex: "Female",
    studyId: "0.0.0.0.0.1",
    numberOfStudyRelatedSeries: 1,
    numberOfStudyRelatedInstances: 1,
    StudyDescription: 1,
    modalities: "CR",
    bodypart: "Lung",
    aiModalities: "CR",
    aiBodypart: "Lung",
  });

  studies.push({
    StudyInstanceUID: "1.2.840.113619.2.5.1762583153.215519.978957063.79",
    StudyDate: "20200203",
    StudyTime: "120022",
    AccessionNumber: "002",
    PatientName: "Bob",
    PatientID: "000002",
    PatientBirthdate: "19880101",
    patientSex: "Male",
    studyId: "0.0.0.0.0.2",
    numberOfStudyRelatedSeries: 1,
    numberOfStudyRelatedInstances: 1,
    StudyDescription: 1,
    modalities: "CR",
    bodypart: "Lung",
    aiModalities: "CT",
    aiBodypart: "Brain",
  });

  studies.push({
    StudyInstanceUID: "1.2.840.113619.2.5.1762583153.215519.978957063.80",
    StudyDate: "20200405",
    StudyTime: "120022",
    AccessionNumber: "003",
    PatientName: "Charlie",
    PatientID: "000003",
    PatientBirthdate: "19880101",
    patientSex: "Female",
    studyId: "0.0.0.0.0.3",
    numberOfStudyRelatedSeries: 1,
    numberOfStudyRelatedInstances: 1,
    StudyDescription: 1,
    modalities: "CR",
    bodypart: "Lung",
    aiModalities: "MRI",
    aiBodypart: "Knee",
  });
  return studies;
}
