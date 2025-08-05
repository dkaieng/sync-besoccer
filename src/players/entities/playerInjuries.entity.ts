
interface InjurySuspension {
    player_id: string;
    injured_start: string;
    injured_end: string;
    injured_type: string;
    injured_name: string;
    injured_return: string;
    active: string;
    group_type: string;
    type_num: string;
    statusType: number;
    injured_key: string;
    start_date: string;
}

interface InjuriesDetail {
    year: string;
    injuries_suspensions: InjurySuspension[]
}

export class PlayerInjuriesEntity {
    player_id: string;
    injuries: InjuriesDetail[];

    constructor(player_id: string, injuries: InjuriesDetail[]) {
        this.player_id = player_id;
        this.injuries = injuries;
    }
}