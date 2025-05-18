const { response } = require('express');
const VerificationRequest = require('../models/VerificationRequest');

const getVerificationRequests = async (req, res = response) => {
   //TODO

   //Verfiicar que el token tenga el rol de admin (lo hace un middleware)
};

const addVerificationRequest = async (req, res = response) => {
   const userId = req.user.id;
   
   try {
      if (VerificationRequest.exists({userId: userId, status: 'Pending'})) {
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

   const certificateUrl = req.files['certificate'][0].path;
   const identificationUrl = req.files['identification'][0].path;

   if(!certificateUrl || !identificationUrl) {
      return res.status(400).json({
         msg: 'Missing required fields: certificate and identification are required.'
      })
   }
   
   const email = req.user.email;
   const newVerificationRequest = new VerificationRequest({userId, email, certificateUrl, identificationUrl})

   try {
      await newVerificationRequest.save();
   } catch (error) {
      console.error(error);
      return res.status(500).json({
         msg: 'An error ocurred while attempting create a verification request.'
      });
   }

   return res.status(201).json({
      msg: 'Verification request created successfully.',
      verificationRequest: {
         date: newVerificationRequest.date,
         status: newVerificationRequest.status
      }
   });
};

const evaluateVerificationRequest = async (req, res = response) => {
   //TODO

   //Verfiicar que el token tenga el rol de admin (lo hace un middleware)
};

const accountIsVerified = async (req, res = response) => {
   //TODO
};

module.exports = {addVerificationRequest};