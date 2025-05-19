import React from 'react';
import styled from 'styled-components';
import TrainerRequestItem from '../TrainerRequestItem';

const Section = styled.div`
  background-color: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #05396B;
`;

const EmptyMessage = styled.p`
  color: #666;
  text-align: center;
  padding: 20px 0;
`;

interface TrainerRequestsSectionProps {
  requests: Array<{
    id: number;
    trainer_id: number;
    client_id: number;
    status: string;
    trainer_username?: string;
    trainer_fullname?: string;
    trainer_avatar?: string;
    client_username?: string;
    client_fullname?: string;
    client_avatar?: string;
  }>;
  type: 'incoming' | 'outgoing';
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
  onCancel?: (id: number) => void;
}

const TrainerRequestsSection: React.FC<TrainerRequestsSectionProps> = ({ 
  requests, 
  type, 
  onAccept, 
  onReject,
  onCancel
}) => {
  if (requests.length === 0) return null;

  return (
    <Section>
      <SectionTitle>
        {type === 'incoming' ? 'Запросы на тренерство' : 'Отправленные запросы'}
      </SectionTitle>
      
      {requests.length === 0 ? (
        <EmptyMessage>
          {type === 'incoming' 
            ? 'У вас нет новых запросов' 
            : 'Вы не отправляли запросы'}
        </EmptyMessage>
      ) : (
        requests.map(request => (
          <TrainerRequestItem
            key={request.id}
            request={request}
            type={type}
            onAccept={onAccept}
            onReject={onReject}
            onCancel={onCancel}
          />
        ))
      )}
    </Section>
  );
};

export default TrainerRequestsSection;