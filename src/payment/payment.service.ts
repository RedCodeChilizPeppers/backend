import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class PaymentService {
    
	// Push dans le chanel paiement sur discord
	async createNotifDiscord(mountant: number) {
	  
		const response = await fetch(
		  "https://discord.com/api/webhooks/1086661014260564100/I9il9fNoZb_brLUONV_ddYJLjFItUPiL8oUMA9TRKPZVjZaMHPpim6blDgl0gNEWSYTH",
		  {
			method: "POST",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({
			  username: "Paiement",
			  avatar_url: "",
			  content: `😍 Nouveau paiement d'un montant de ${mountant} €.`,
			  mountant: mountant,
			}),
		  }
		);
	  
		if (response.ok) {
		  return "Notification envoyée sur Discord.";
		} else {
		  throw new Error(
			"Une erreur est survenue lors de l'envoi de la notification Discord."
		  );
		}
	}
	  

}


