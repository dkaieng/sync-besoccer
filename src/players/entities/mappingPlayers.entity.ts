export class MappingPlayersEntity {
    player_id: string;
    thesport_id: string;

    constructor(player_id: string, thesport_id: string) {
        this.player_id = player_id;
        this.thesport_id = thesport_id;
    }
}