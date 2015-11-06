Meteor.methods({
  'GetStudyMetadata' : function(studyInstanceUid) {
    log.info('GetStudyMetadata(%s)', studyInstanceUid);

    var server = Meteor.settings.dicomWeb.endpoints[0];

    //return Services.QIDO.Instances(server, studyInstanceUid);
    return Services.WADO.RetrieveMetadata(server, studyInstanceUid);
  }
});