import { DataBoundObject, LoadingState, unixTimestamp } from '@space-truckers/common'
import { ShipStats } from '@space-truckers/types'
import { BehaviorSubject, combineLatest, from, map, of } from 'rxjs'
import { injectable } from 'tsyringe'
import { HangarRepo } from '../../../../../db/hangar.repo'


@injectable()
export class ShipStatsDatasource extends DataBoundObject<ShipStats> {
  constructor(
    _repo: HangarRepo,
  ) {
    type ShipLoaderServiceStatus = ShipStats | LoadingState
    super(
      new BehaviorSubject<ShipLoaderServiceStatus>(LoadingState.Idle),
      from(_repo.getShip()),
      (patch) => combineLatest([
        of(patch),
        _repo.getRandomNumber(),
        of(unixTimestamp())
      ]).pipe(map(([patch, rn, timestamp]) => ({ ...patch, ...timestamp, rn })))
    )
  }
}