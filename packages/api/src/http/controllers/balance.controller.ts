import { AppController } from '@space-truckers/common'
import { Request, Response } from 'express'
import { Injectable } from 'injection-js'
import { AppContainer } from '../../server/app-container'

@Injectable()
export class BalanceController implements AppController {
    constructor(
        { app, db }: AppContainer
    ) {
        app.get('/getBalance', async (req: Request, res: Response) => {
            res.send('$1000.00');
        });
    }
}
