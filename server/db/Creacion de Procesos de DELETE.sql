

CREATE PROCEDURE Del_Usuarios(
  IN PI_cod_user_per Int
)
BEGIN
  START TRANSACTION;
    
  UPDATE usuarios
  SET estado_usuario = 'Disabled'
  WHERE cod_usuario = PI_cod_user_per;
COMMIT;
END;











-- qwe