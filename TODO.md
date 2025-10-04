# TODO: Unificar FileUpload em todas as páginas

## Passos a completar:

1. **Atualizar InvestigationForm.tsx**
   - Substituir o sistema de upload centralizado pelo componente FileUpload
   - Remover código redundante de upload e usar apenas attachments com FileUpload

2. **Verificar outros formulários**
   - Verificar BaseForm.tsx, ChargeForm.tsx, DeepForm.tsx, GangForm.tsx, PersonForm.tsx, VehicleForm.tsx
   - Adicionar FileUpload onde necessário para anexos
   - Concluído: BaseForm, DeepForm, PersonForm, VehicleForm usam sistema de imagens diferente (data URLs ou photoUrl único)
   - ChargeForm e GangForm não têm anexos

3. **Testar funcionalidade**
   - Garantir que uploads funcionem consistentemente em todas as páginas

## Status:
- [x] InvestigationForm.tsx atualizado
- [x] MeetingForm.tsx atualizado
- [x] AuctionForm.tsx atualizado
- [x] Outros formulários verificados (BaseForm, DeepForm, PersonForm, VehicleForm usam sistema diferente; ChargeForm e GangForm não têm anexos)
- [ ] Testes realizados
