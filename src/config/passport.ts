import passport from 'passport'
import { BasicStrategy } from 'passport-http'
import { User, UserInstance } from '../models/User';
import { NextFunction, Request, Response } from 'express';
const notAuthorizedJson = {status: 401, message: 'Não autorizado'};

passport.use(new BasicStrategy( async (email, password, done)=>{
    // Verificação do usuário e senha
    if(email && password){
        let user = await User.findOne({
            where:{email, password}
        });
        if(user){
            return done(null, user);
        }
    } 
        return done(notAuthorizedJson, false);
    //return done() // argumentos 1: erros, 2: dados do usuário
}))

export const privateRoute = (req: Request, res: Response, next: NextFunction) =>{
const authFunction = passport.authenticate('basic', (err: Error, user:UserInstance)=>{
    req.user = user;
    return user? next() : next(notAuthorizedJson)

    // if(user){
    //     next()
    // } else {
    //     next(notAuthorizedJson)
    // }
})(req, res, next); // Cria a função já executando-a
}

export default passport