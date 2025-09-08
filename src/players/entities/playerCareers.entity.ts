export class PlayerCareersEntity {
    player_id: string;
    player_national_career: any[];
    player_summary_career: any[];
    player_team_career: any[];

    constructor(player_id: string, player_national_career: any, player_summary_career: any,  player_team_career: any) {
        this.player_id = player_id;
        this.player_national_career = player_national_career;
        this.player_summary_career = player_summary_career;
        this.player_team_career = player_team_career;
    }
}
