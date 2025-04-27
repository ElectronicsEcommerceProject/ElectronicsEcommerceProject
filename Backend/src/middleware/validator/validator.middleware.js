import { NextFunctions,Request,Response } from 'express';

import {StatusCodes} from 'http-status-codes';
import MESSAGE from '../../constants/message';


const validator =(schema,property=null)=>{
    return (req,res,next)=>{

        try{

            let payload;

            if(property){
                payload = JSON.parse(req.body[property]);
            }else{
                payload = req.body;
            }
            const {error} = schema.validate(payload);
            if(error){
                throw error
            }
            next();
        }
        catch(err){
            return res.status(StatusCodes.BAD_REQUEST).json({
                err,
                message: MESSAGE.custom("Invalid payload"),
            });
        }
       
    }
}

export default validator;