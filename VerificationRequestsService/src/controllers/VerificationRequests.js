const { response } = require('express');
const path = require('path');
const fs = require('fs');
const VerificationRequest = require('../models/VerificationRequest');

const getVerificationRequests = async (req, res = response) => {
   if(!req.body) {
      return res.status(400).json({
         msg: 'The request body is required'
      })
   }

   const { count, cursor } = req.body;
   if(!count) {
      return res.status(400).json({
         msg: 'The count field is required at least'
      })
   }

   const query = { status: 'Pending' }
   if (cursor) {
      query.date = { $gt: cursor };
   }

   let verificationRequests;
   try {
      verificationRequests = await VerificationRequest
                                    .find(query, '_id userId certificateUrl identificationUrl date')
                                    .sort({ date: 1 })
                                    .limit(count);
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         msg: 'An error ocurred while attempting get verification requests'
      });
   }

   return res.status(200).json({
      verificationRequests
   });
};

const getVerificationRequestDocument = async (req, res = response) => {
   const fileName = req.params.fileName;
   const filePath = path.resolve(__dirname, '../', process.env.UPLOADS_FOLDER, fileName);
   return res.sendFile(filePath, error => {
      if (error) {
         console.log(filePath);
         return res.status(404).json({
            msg: 'Document not found'
         });
      }
   });
};

const addVerificationRequest = async (req, res = response) => {
   const userId = req.user.id;

   try {
      const userWithPendingRequest = await VerificationRequest.exists({userId: userId, status: 'Pending'});
      if (userWithPendingRequest) {
         return res.status(409).json({
            msg: 'User has a pending verification request'
         });
      }
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         msg: 'An error ocurred while attempting create a verification request.'
      });
   }

   if (!req.files || !req.files['certificate'] || !req.files['identification']) {
      return res.status(400).json({
         msg: 'The certificate and identification are required'
      });
   }

   const email = req.user.email;
   const certificateUrl = req.files['certificate'][0].path;
   const identificationUrl = req.files['identification'][0].path;

   let newVerificationRequest = new VerificationRequest({userId, email, certificateUrl, identificationUrl})

   try {
      newVerificationRequest = await newVerificationRequest.save();
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         msg: 'An error ocurred while attempting create a verification request.'
      });
   }

   return res.status(201).json({
      verificationRequest: {
         id: newVerificationRequest._id,
         date: newVerificationRequest.date,
         status: newVerificationRequest.status
      }
   });
};

const evaluateVerificationRequest = async (req, res = response) => {
   const requestApproved = req.body.approved;

   if (requestApproved == null) {
      return res.status(400).json({
         msg: 'The approved field is required'
      });
   }

   let updatedVerificationRequest;
   try {
      updatedVerificationRequest = await VerificationRequest.findById(req.params.id);
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         msg: 'An error ocurred while attempting update the verification request.'
      });
   }

   if (!updatedVerificationRequest) {
      return res.status(404).json({
         msg: 'Verification request not found'
      });
   }

   if (updatedVerificationRequest.status !== 'Pending') {
      return res.status(409).json({
         msg: 'The verification request is already evaluated'
      })
   }

   const newStatus = requestApproved ? 'Approved' : 'Denied';
   try {
      await VerificationRequest.findByIdAndUpdate(updatedVerificationRequest.id, { status: newStatus });
   }
   catch (error) {
      console.error(error);
      return res.status(500).json({
         msg: 'An error ocurred while attempting update the verification request.'
      });
   }

   //TODO: comunicarle al servicio de Users que actualice el campo de verified a true
   //Utilizar RabitMQ


   const certificatePath = path.join(__dirname, process.env.UPLOADS_FOLDER_FOR_DELETE, updatedVerificationRequest.certificateUrl);
   const identificationPath = path.join(__dirname, process.env.UPLOADS_FOLDER_FOR_DELETE, updatedVerificationRequest.identificationUrl);
   const fileRemovalErrorHandler = (error) => {
      if (error) {
        console.error(error);
      }
   };
   fs.unlink(certificatePath, fileRemovalErrorHandler);
   fs.unlink(identificationPath, fileRemovalErrorHandler);

   return res.status(200).json({
      msg: 'Verification request updated successfully'
   });
};

const updateUserVerification = () => {
   
};

module.exports = { getVerificationRequests, getVerificationRequestDocument, addVerificationRequest, evaluateVerificationRequest };