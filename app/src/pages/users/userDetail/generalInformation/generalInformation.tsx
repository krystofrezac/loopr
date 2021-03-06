import React from 'react';

import { useTranslation } from 'lib/i18n';

import EditableListItem from 'components/EditableListItem';
import HorizontalList from 'components/HorizontalList';

import { GeneralInformationProps } from './types';

const GeneralInformation: React.FC<GeneralInformationProps> = props => {
  const { t } = useTranslation();

  return (
    <>
      <HorizontalList>
        <EditableListItem
          primary={t('gqlObjects.user.firstname')}
          secondary={props.user?.firstname || ''}
          edit="secondary"
          onSubmit={firstname => props.onChange({ firstname })}
        />
        <EditableListItem
          primary={t('gqlObjects.user.lastname')}
          secondary={props.user?.lastname || ''}
          edit="secondary"
          onSubmit={lastname => props.onChange({ lastname })}
        />
        <EditableListItem
          primary={t('gqlObjects.user.email')}
          secondary={props.user?.email || ''}
          edit="secondary"
          onSubmit={username => props.onChange({ email: username })}
        />
        <EditableListItem
          primary={t('gqlObjects.user.role')}
          secondary={props.user?.role.id || ''}
          edit="secondary"
          onSubmit={role => props.onChange({ role })}
          lookup={props.rolesLookup}
        />
      </HorizontalList>
    </>
  );
};

export default GeneralInformation;
