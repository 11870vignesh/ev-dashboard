import { ButtonColor, ButtonType, TableActionDef } from 'app/types/Table';
import { ChargingStation, ChargingStationButtonAction, OCPPGeneralResponse } from 'app/types/ChargingStation';

import { ActionResponse } from 'app/types/DataResult';
import { CentralServerService } from 'app/services/central-server.service';
import { DialogService } from 'app/services/dialog.service';
import { MessageService } from 'app/services/message.service';
import { Router } from '@angular/router';
import { SpinnerService } from 'app/services/spinner.service';
import { TableAction } from 'app/shared/table/actions/table-action';
import { TranslateService } from '@ngx-translate/core';
import { Utils } from 'app/utils/Utils';

export class TableChargingStationsForceUnavailableStatusAction implements TableAction {
  private action: TableActionDef = {
    id: ChargingStationButtonAction.FORCE_UNAVAILABLE_STATUS,
    type: 'button',
    icon: 'stop',
    color: ButtonColor.WARN,
    name: 'chargers.force_unavailable_status_action',
    tooltip: 'general.tooltip.force_unavailable_status',
    action: this.forceUnavailable,
  };

  public getActionDef(): TableActionDef {
    return this.action;
  }

  private forceUnavailable(chargingStation: ChargingStation, dialogService: DialogService, translateService: TranslateService,
      messageService: MessageService, centralServerService: CentralServerService, spinnerService: SpinnerService, router: Router) {
    // Show yes/no dialog
    dialogService.createAndShowYesNoDialog(
      translateService.instant('chargers.force_unavailable_status_title'),
      translateService.instant('chargers.force_unavailable_status_confirm', { chargeBoxID: chargingStation.id }),
    ).subscribe((result) => {
      if (result === ButtonType.YES) {
        spinnerService.show();
        // Call
        centralServerService.chargingStationChangeAvailability(chargingStation.id, false).subscribe((response: ActionResponse) => {
            spinnerService.hide();
            if (response.status === OCPPGeneralResponse.ACCEPTED) {
              messageService.showSuccessMessage(
                translateService.instant('chargers.force_unavailable_status_success', { chargeBoxID: chargingStation.id }));
            } else {
              Utils.handleError(JSON.stringify(response),
                messageService, 'chargers.force_unavailable_status_error');
            }
          }, (error: any) => {
            spinnerService.hide();
            Utils.handleHttpError(error, router, messageService,
              centralServerService, 'chargers.force_unavailable_status_error');
          });
        }
    });
  }
}
