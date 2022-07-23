

-- UPDATE Pais
CREATE PROCEDURE Upt_Pais(
   IN PI_cod_pais Int,
   IN PV_nom_pais VarChar(255)
)
BEGIN
  START TRANSACTION;
  UPDATE pais SET nom_pais = PV_nom_pais WHERE cod_pais = PI_cod_pais;
COMMIT;
END;


-- UPDATE Departamento
CREATE PROCEDURE Upt_Departamento(
   IN PI_cod_depto Int,
   IN PV_nom_depto VarChar(255),
   IN PI_cod_pais Int
)
BEGIN
  START TRANSACTION;
  UPDATE departamento SET nom_depto = PV_nom_depto, cod_pais = PI_cod_pais WHERE cod_depto = PI_cod_depto;
COMMIT;
END;

-- UPDATE Municipio
CREATE PROCEDURE Upt_Municipio(
   IN PI_cod_municipio Int,
   IN PV_nom_municipio VarChar(255),
   IN PI_cod_depto Int
)
BEGIN
  START TRANSACTION;
  UPDATE municipio SET nom_municipio = PV_nom_municipio, cod_depto = PI_cod_depto WHERE cod_municipio = PI_cod_municipio;
COMMIT;
END;


-- UPDATE Imagen de Usuario
CREATE PROCEDURE Upt_ImgUsuario(
   IN PI_cod_usuario Int,
   IN PV_img_usuario Varchar(255)
)
BEGIN
  START TRANSACTION;
  UPDATE usuarios SET img_usuario = PV_img_usuario WHERE cod_usuario = PI_cod_usuario;
COMMIT;
END;


-- PRUEBITA
CREATE PROCEDURE Upt_Usuarios(
    -- Reference Id User
    IN PI_cod_usuario Int,

    -- Params User
    IN PV_nomb_usuario Varchar(255)
   ,IN PV_pass_usuario Varchar(255)
   ,IN PV_img_usuario Varchar(255)
   ,IN PEN_estado_usuario Enum('Enabled', 'Disabled')
   ,IN PEN_tip_usuario Enum('User', 'Admin'),


 -- Direccion Persona
    IN PV_desc_direccion_persona VarChar(255),
    IN PI_cod_municipio_persona Int,

-- Telefono Persona
    IN PV_num_telefono_persona VarChar(30),
    IN PEN_tip_telefono_persona Enum('F', 'C'),

    -- Params Personas
    IN PV_identidad_per VarChar(16),
    IN PV_nom_per VarChar(255),
    IN PV_apell_per VarChar(255),
    IN PEN_sex_per Enum('F', 'M'),
    IN PEN_ind_civil Enum('S', 'C', 'D', 'V'),
    IN PDAT_fec_nac Date,
    IN PV_tip_per VarChar(255),


    -- Params Empresa Persona
    IN PI_cod_empresa Int

)
BEGIN
  START TRANSACTION;
  
    SELECT
    @cod_direccion_casa := prs.cod_direccion_casa,
    @cod_telefono_persona := prs.cod_telefono_persona,
    @cod_empresa_persona := prs.cod_empresa,
    @cod_per := rup.cod_per

    FROM rel_usuarios_personas rup
    JOIN personas prs On prs.cod_per = rup.cod_per
    JOIN usuarios urs On urs.cod_usuario = rup.cod_usuario
    WHERE urs.cod_usuario = PI_cod_usuario;



-- Updates Direccion Casa de Persona
    Update direccion
    SET
        desc_direccion = PV_desc_direccion_persona,
        cod_municipio = PI_cod_municipio_persona
    WHERE cod_direccion = @cod_direccion_casa;

-- Update Usuarios
    Update usuarios
    SET
        nom_usuario = PV_nomb_usuario,
        pass_usuario = PV_pass_usuario,
        img_usuario = PV_img_usuario,
        estado_usuario = PEN_estado_usuario,
        tip_usuario = PEN_tip_usuario
    WHERE cod_usuario = PI_cod_usuario;

    -- Updates Telefono de la Persona
    Update telefono
    SET
        num_telefono = PV_num_telefono_persona,
        tip_telefono = PEN_tip_telefono_persona
    WHERE cod_telefono = @cod_telefono_persona;


    -- Updates Persona
    Update personas
    SET
        identidad_per = PV_identidad_per,
        nom_per = PV_nom_per,
        apell_per = PV_apell_per,
        sex_per = PEN_sex_per,
        ind_civil = PEN_ind_civil,
        fec_nac = PDAT_fec_nac,
        tip_per = PV_tip_per,
        cod_empresa = PI_cod_empresa
    WHERE cod_per = @cod_per;

COMMIT;
END;



-- UPDATE Empresa
CREATE PROCEDURE Upt_Empresa(
   IN PI_cod_empresa Int,

   IN PV_nom_empresa VarChar(255),
   IN PV_tip_empresa VarChar(255),
   
   -- Params Direccion Empresa
   IN PV_desc_direccion_empresa VarChar(255),
   IN PI_cod_municipio_empresa Int,

   -- Params Telefono Empresa
   IN PV_num_telefono_empresa VarChar(30),
   IN PEN_tip_telefono_empresa Enum('F', 'C')
)
BEGIN
  START TRANSACTION;

    SELECT
        @cod_telefono_empresa := emp.cod_telefono,
        @cod_direccion_empresa := emp.cod_direccion
    FROM empresa emp
    JOIN telefono tel On tel.cod_telefono = emp.cod_telefono
    JOIN direccion dir On dir.cod_direccion = emp.cod_direccion
    WHERE cod_empresa = PI_cod_empresa;

    UPDATE direccion 
    SET 
        desc_direccion = PV_desc_direccion_empresa,
        cod_municipio = PI_cod_municipio_empresa
    WHERE cod_direccion = @cod_direccion_empresa;

    UPDATE telefono
    SET
        num_telefono = PV_num_telefono_empresa,
        tip_telefono = PEN_tip_telefono_empresa
    WHERE cod_telefono = @cod_telefono_empresa;

    UPDATE empresa
    SET
        nom_empresa = PV_nom_empresa,
        tip_empresa = PV_tip_empresa
    WHERE cod_empresa = PI_cod_empresa;

COMMIT;
END;



-- UPDATE Reportes
CREATE PROCEDURE Upt_Reportes(
    IN PI_cod_reporte Int
    ,IN PV_titulo_reporte VarChar(255)
    ,IN PLT_desc_reporte LongText
    ,IN PEN_formato_reporte Enum('doc', 'html', 'xlsx', 'txt', 'text', 'pdf', 'png', 'jpg', 'jpeg')
    ,IN PV_url_archivo VarChar(255)
    ,IN PV_correo_electronico VarChar(255)
    ,IN PT_hora_generar_reporte Time
    ,IN PEN_tipo_reporte Enum('Generado', 'Guardado')
    ,IN PEN_ind_reporte Enum('Enabled', 'Disabled')
    ,IN PEN_tiempo_generar_reporte Enum('Diariamente', 'Semanalmente', 'Mensualmente', 'Anualmente')
)
BEGIN
  START TRANSACTION;

    UPDATE reportes
    SET
        titulo_reporte = PV_titulo_reporte
        ,desc_reporte = PLT_desc_reporte
        ,formato_reporte = PEN_formato_reporte
        ,url_archivo = PV_url_archivo
        ,correo_electronico = PV_correo_electronico
        ,hora_generar_reporte = PT_hora_generar_reporte
        ,tipo_reporte = PEN_tipo_reporte
        ,ind_reporte = PEN_ind_reporte
        ,tiempo_generar_reporte = PEN_tiempo_generar_reporte
    WHERE cod_reporte = PI_cod_reporte;

COMMIT;
END;



-- UPDATE Estadisticas
CREATE PROCEDURE Upt_Estadisticas(
    IN PI_cod_estadistica Int
    ,IN PV_titulo_estadistica VarChar(255)
    ,IN PLT_desc_estadistica LongText
    ,IN PEN_formato_estadistica Enum('doc', 'html', 'xlsx', 'txt', 'text', 'pdf', 'png', 'jpg', 'jpeg')
    ,IN PV_url_archivo VarChar(255)
    ,IN PV_correo_electronico VarChar(255)
    ,IN PT_hora_generar_estadistica Time
    ,IN PEN_tipo_estadistica Enum('Generado', 'Guardado')
    ,IN PEN_ind_estadistica Enum('Enabled', 'Disabled')
    ,IN PEN_tiempo_generar_estadistica Enum('Diariamente', 'Semanalmente', 'Mensualmente', 'Anualmente')
)
BEGIN
  START TRANSACTION;

    UPDATE estadisticas
    SET
        titulo_estadistica = PV_titulo_estadistica
        ,desc_estadistica = PLT_desc_estadistica
        ,formato_estadistica = PEN_formato_estadistica
        ,url_archivo = PV_url_archivo
        ,correo_electronico = PV_correo_electronico
        ,hora_generar_estadistica = PT_hora_generar_estadistica
        ,tipo_estadistica = PEN_tipo_estadistica
        ,ind_estadistica = PEN_ind_estadistica
        ,tiempo_generar_estadistica = PEN_tiempo_generar_estadistica
    WHERE cod_estadistica = PI_cod_estadistica;

COMMIT;
END;



-- UPDATE Distribucion
CREATE PROCEDURE Upt_Distribucion(
   IN PI_cod_distribucion Int
   ,IN PV_num_placa VarChar(50)
   ,IN PV_tip_transporte VarChar(255)
)
BEGIN
  START TRANSACTION;

    UPDATE distribucion
    SET
        num_placa = PV_num_placa,
        tip_transporte = PV_tip_transporte
    WHERE cod_distribucion = PI_cod_distribucion;

COMMIT;
END;


-- UPDATE Marca
CREATE PROCEDURE Upt_Marca(
    IN PI_cod_marca Int
    ,IN PV_nom_marca Varchar(255)

)
BEGIN
  START TRANSACTION;
  UPDATE marca 
  SET 
    nom_marca = PV_nom_marca
  WHERE cod_marca = PI_cod_marca;
COMMIT;
END;



-- UPDATE Inventario Inicial
CREATE PROCEDURE Upt_Inventario_Inicial(
    In PI_cod_pro Int,

    IN PV_id_pro VarChar(30),
    IN PV_nom_pro VarChar(255),
    IN PI_unidad_pro Int,
    IN PDEC_pre_pro Decimal(10,0),
    IN PD_fec_elab Date,
    In PD_fec_venc Date
)
BEGIN
  START TRANSACTION;
  UPDATE inventario 
  SET 
    id_pro = PV_id_pro,
    nom_pro = PV_nom_pro,
    unidad_pro = PI_unidad_pro,
    pre_pro = PDEC_pre_pro,
    fec_elab = PD_fec_elab,
    fec_venc = PD_fec_venc
  WHERE cod_pro = PI_cod_pro;

COMMIT;
END;


-- UPDATE Detalle Pedido
CREATE PROCEDURE Upt_DetallePedido(
    IN PI_cod_pedido Int,

    IN PV_id_pro_pedido VarChar(30),
    IN PI_cant_pedido Int,
    IN PDEC_val_pedido Decimal(10, 0),
    IN PEN_tip_pago Enum('C', 'D', 'E'),
    IN PI_cod_distribucion Int,
    IN PI_cod_empresa Int,
    IN PI_cod_marca Int,

    -- Params Rel_DetPedido_Inventario
    IN PI_cod_pro Int
)
BEGIN
  START TRANSACTION;

    SELECT
        @cant_anterior_pedida := dp.cant_pedido,
        @id_anterior_pedido := dp.id_pro_pedido
    FROM rel_detpedido_inventario rdi
    JOIN inventario inv On inv.cod_pro = rdi.cod_pro
    JOIN detalle_pedido dp On dp.cod_pedido = rdi.cod_pedido
    WHERE rdi.cod_pedido = PI_cod_pedido;

    -- Sumarle lo anterior para luego mas adelante restarle el nuevo cambio
    UPDATE inventario
    SET
        unidad_pro = unidad_pro + @cant_anterior_pedida
    WHERE id_pro = @id_anterior_pedido;

    UPDATE inventario
    SET
        unidad_pro = unidad_pro - PI_cant_pedido
    WHERE id_pro = PV_id_pro_pedido;


    SELECT
        @pre_pro_pedido := inv.pre_pro,
        @total_val_pedido := @pre_pro_pedido * PI_cant_pedido
    FROM inventario inv
    WHERE inv.id_pro = PV_id_pro_pedido;

    UPDATE detalle_pedido
    SET
        id_pro_pedido = PV_id_pro_pedido,
        cant_pedido = PI_cant_pedido,
        val_pedido = @total_val_pedido,
        tip_pago = PEN_tip_pago,
        cod_distribucion = PI_cod_distribucion,
        cod_empresa = PI_cod_empresa,
        cod_marca = PI_cod_marca
    WHERE cod_pedido = PI_cod_pedido;

    UPDATE rel_detpedido_inventario
    SET
        cod_pro = PI_cod_pro
    WHERE rel_detpedido_inventario.cod_pedido = PI_cod_pedido;

COMMIT;
END;



-- qwe