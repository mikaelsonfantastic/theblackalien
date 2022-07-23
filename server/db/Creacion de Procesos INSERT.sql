
-- Insertar Pais
CREATE PROCEDURE Ins_Pais(
   IN PV_nom_pais Varchar(255)
)
BEGIN
  START TRANSACTION;
  
  INSERT INTO aguamanantialdb.pais(
  nom_pais
  )VALUES (
   PV_nom_pais
  );
  
COMMIT;
END;


-- Insertar Depto
CREATE PROCEDURE Ins_Departamento(
   IN PV_nom_depto Varchar(255),
   IN PI_cod_pais Int
)
BEGIN
  START TRANSACTION;
  
  INSERT INTO aguamanantialdb.departamento(
        nom_depto,
        cod_pais
    ) VALUES (
        PV_nom_depto,
        PI_cod_pais
    );
COMMIT;
END;


-- Insertar Municipio
CREATE PROCEDURE Ins_Municipio(
   IN PV_nom_municipio Varchar(255),
   IN PI_cod_depto Int
)
BEGIN
  START TRANSACTION;
  
  INSERT INTO aguamanantialdb.municipio(
        nom_municipio,
        cod_depto
    ) VALUES (
        PV_nom_municipio,
        PI_cod_depto
    );
COMMIT;
END;


-- Insertar Municipio
CREATE PROCEDURE Ins_Usuarios(
    -- Params Direccion
    IN PV_desc_direccion VarChar(255),
    IN PI_cod_municipio Int,

    -- Params Telefono
    IN PV_num_telefono VarChar(30),
    IN PEN_tip_telefono Enum('F', 'C'),

    -- Params Personas
    IN PV_identidad_per VarChar(16),
    IN PV_nom_per VarChar(255),
    IN PV_apell_per VarChar(255),
    IN PEN_sex_per Enum('F', 'M'),
    IN PEN_ind_civil Enum('S', 'C', 'D', 'V'),
    IN PDAT_fec_nac Date,
    IN PV_tip_per VarChar(255),

        -- Params Foraneos
    IN PI_cod_empresa Int,

    -- Params Usuarios
    IN PV_nomb_usuario Varchar(255)
   ,IN PV_pass_usuario Varchar(255)
   ,IN PV_img_usuario Varchar(255)
   ,IN PV_correo_electronico Varchar(255)
   ,IN PEN_estado_usuario Enum('Enabled', 'Disabled')
   ,IN PEN_tip_usuario Enum('User', 'Admin')
)
BEGIN
  START TRANSACTION;
  -- Insertar Direccion Final Personas
    INSERT INTO aguamanantialdb.direccion(
        desc_direccion,
        cod_municipio
    ) VALUES (
        PV_desc_direccion,
        PI_cod_municipio
    );
    SELECT @cod_direccion := Max(cod_direccion) FROM direccion; -- IMPORTANT!


 -- Insertar Telefono
    INSERT INTO aguamanantialdb.telefono(
        num_telefono,
        tip_telefono
    ) VALUES (
        PV_num_telefono,
        PEN_tip_telefono
    );
    SELECT @cod_telefono := Max(cod_telefono) FROM telefono; -- IMPORTANT!


 -- Insertar Personas
    INSERT INTO aguamanantialdb.personas(
        identidad_per,
        nom_per,
        apell_per,
        sex_per,
        ind_civil,
        fec_nac,
        tip_per,
        cod_direccion_casa,
        cod_telefono_persona,
        cod_empresa
    ) VALUES (
        PV_identidad_per,
        PV_nom_per,
        PV_apell_per,
        PEN_sex_per,
        PEN_ind_civil,
        PDAT_fec_nac,
        PV_tip_per,
        @cod_direccion,
        @cod_telefono,
        PI_cod_empresa
    );
    SELECT @cod_per := Max(cod_per) FROM personas; -- IMPORTANT!

  -- Insertar Usuarios
    INSERT INTO aguamanantialdb.usuarios(
        nom_usuario,
        pass_usuario,
        img_usuario,
        correo_electronico,
        estado_usuario,
        tip_usuario
    ) VALUES (
        PV_nomb_usuario
        ,PV_pass_usuario
        ,PV_img_usuario
        ,PV_correo_electronico
        ,PEN_estado_usuario
        ,PEN_tip_usuario
    );
    SELECT @cod_usuario := Max(cod_usuario) FROM usuarios; -- IMPORTANT!

   -- Insertar REL_Usuarios_Personas
    INSERT INTO aguamanantialdb.rel_usuarios_personas(
        cod_usuario,
        cod_per
    ) VALUES (
        @cod_usuario,
        @cod_per
    );

COMMIT;
END;


-- ********************** PROCESOS DE ALMACENADO DE REPORTES **********************
-- Proceso Insertar Reportes
CREATE PROCEDURE Ins_Reportes(
     IN PV_titulo_reporte VarChar(255)
    ,IN PLT_desc_reporte LongText
    ,IN PEN_formato_reporte Enum('docx', 'html', 'xlsx', 'txt', 'text', 'pdf', 'png', 'jpg', 'jpeg')
    ,IN PV_url_archivo VarChar(255)
    ,IN PV_correo_electronico VarChar(255)
    ,IN PT_hora_generar_reporte Time
    ,IN PEN_tipo_reporte Enum('Generado', 'Guardado')
    ,IN PEN_ind_reporte Enum('Enabled', 'Disabled')
    ,IN PEN_tiempo_generar_reporte Enum('Diariamente', 'Semanalmente', 'Mensualmente', 'Anualmente')
    ,IN PBI_cod_usuario Int
)
BEGIN
  START TRANSACTION; 

-- ##############     TABLA    REPORTES    ##############
-- ######################################################
  INSERT INTO aguamanantialdb.reportes(
    titulo_reporte
    ,desc_reporte
    ,formato_reporte
    ,url_archivo
    ,correo_electronico
    ,hora_generar_reporte
    ,tipo_reporte
    ,ind_reporte
    ,tiempo_generar_reporte
    ,cod_usuario
  ) VALUES (
     PV_titulo_reporte
    ,PLT_desc_reporte
    ,PEN_formato_reporte
    ,PV_url_archivo
    ,PV_correo_electronico
    ,PT_hora_generar_reporte
    ,PEN_tipo_reporte
    ,PEN_ind_reporte
    ,PEN_tiempo_generar_reporte
    ,PBI_cod_usuario
  );
  SELECT @cod_reporte := Max(cod_reporte) FROM reportes;

-- ############## TABLA HISTORIAL REPORTES ##############
-- ######################################################
  -- Insertar en la tabla Historial Reportes
  INSERT INTO aguamanantialdb.historial_reportes(
  ) VALUES (
  );
  SELECT @cod_historial_reporte := Max(cod_historial_reporte) FROM historial_reportes;

-- ############## TABLA HISTORIAL REPORTES ##############
-- ######################################################
  -- Insertar en la tabla Relacional Historial con Reportes
  INSERT INTO aguamanantialdb.rel_hist_reportes(
   cod_historial_reporte
  ,cod_reporte
  ) VALUES (
    @cod_historial_reporte,
    @cod_reporte
  );
COMMIT;
END;



-- ********************** PROCESOS DE ALMACENADO DE MARCA **********************
CREATE PROCEDURE Ins_Marca(
   IN PV_nom_marca Varchar(255)
)
BEGIN
  START TRANSACTION;
  
    INSERT INTO aguamanantialdb.marca(
        nom_marca
    )VALUES (
        PV_nom_marca
    );
    
COMMIT;
END;


-- ********************** PROCESOS DE ALMACENADO DE DISTRIBUCION **********************
CREATE PROCEDURE Ins_Distribucion(
   IN PV_num_placa VarChar(50)
   ,IN PV_tip_transporte VarChar(255)
)
BEGIN
  START TRANSACTION;
  
    INSERT INTO aguamanantialdb.distribucion(
        num_placa,
        tip_transporte
    )VALUES (
        PV_num_placa,
        PV_tip_transporte
    );
    
COMMIT;
END;


-- ********************** PROCESOS DE ALMACENADO DE EMPRESA **********************
CREATE PROCEDURE Ins_Empresa(
     -- Params Direccion
    IN PV_desc_direccion VarChar(255),
    IN PI_cod_municipio Int,
      -- Params Telefono
    IN PV_num_telefono VarChar(30),
    IN PEN_tip_telefono Enum('F', 'C'),

    IN PV_nom_empresa VarChar(255),
    IN PV_tip_empresa VarChar(255)
)
BEGIN
  START TRANSACTION;
  
    -- Insertar Direccion Final Personas
    INSERT INTO aguamanantialdb.direccion(
        desc_direccion,
        cod_municipio
    ) VALUES (
        PV_desc_direccion,
        PI_cod_municipio
    );
    SELECT @cod_direccion := Max(cod_direccion) FROM direccion; -- IMPORTANT!

 -- Insertar Telefono
    INSERT INTO aguamanantialdb.telefono(
        num_telefono,
        tip_telefono
    ) VALUES (
        PV_num_telefono,
        PEN_tip_telefono
    );
    SELECT @cod_telefono := Max(cod_telefono) FROM telefono; -- IMPORTANT!

 -- Insertar Empresa
    INSERT INTO aguamanantialdb.empresa(
        nom_empresa,
        tip_empresa,
        cod_direccion,
        cod_telefono
    ) VALUES (
        PV_nom_empresa,
        PV_tip_empresa,
        @cod_direccion,
        @cod_telefono
    );
    
COMMIT;
END;


-- ********************** PROCESOS DE ALMACENADO DE INVENTARIO **********************
CREATE PROCEDURE Ins_Inventario_Inicial(
   IN PV_id_pro VarChar(30),
   IN PV_nom_pro VarChar(255),
   IN PI_unidad_pro Int,
   IN PDEC_pre_pro Decimal(10,0),
   IN PD_fec_elab Date,
   In PD_fec_venc Date
)
BEGIN
  START TRANSACTION;
  
    INSERT INTO aguamanantialdb.inventario(
        id_pro,
        nom_pro,
        unidad_pro,
        pre_pro,
        fec_elab,
        fec_venc
    )VALUES (
        PV_id_pro,
        PV_nom_pro,
        PI_unidad_pro,
        PDEC_pre_pro,
        PD_fec_elab,
        PD_fec_venc
    );
    
COMMIT;
END;



-- ********************** PROCESOS DE ALMACENADO DE DETALLE_PEDIDO**********************
-- Insertar Ventas 
CREATE PROCEDURE Ins_DetallePedido(
   IN PV_id_pro_pedido VarChar(30),
   IN PI_cant_pedido Int,
   IN PDEC_val_pedido Decimal(10, 0),
   IN PEN_tip_pago Enum('C', 'D', 'E'),
   IN PI_cod_distribucion Int,
   IN PI_cod_empresa Int,
   IN PI_cod_marca Int,

   -- Params Rel_DetPedido_Inventario
   IN cod_pro Int
)
BEGIN
  START TRANSACTION;
  
    INSERT INTO aguamanantialdb.detalle_pedido(
        id_pro_pedido,
        cant_pedido,
        val_pedido,
        tip_pago,
        cod_distribucion,
        cod_empresa,
        cod_marca
    )VALUES (
        PV_id_pro_pedido,
        PI_cant_pedido,
        PDEC_val_pedido,
        PEN_tip_pago,
        PI_cod_distribucion,
        PI_cod_empresa,
        PI_cod_marca
    );

    SELECT @cod_pedido := Max(cod_pedido) FROM detalle_pedido;


-- Insertar REL_DetPedido_Inventario
    INSERT INTO aguamanantialdb.rel_detpedido_inventario(
        cod_pedido,
        cod_pro
    )VALUES (
        @cod_pedido,
        cod_pro
    );
    SELECT @cod_detpedido_inv := Max(cod_detpedido_inv) FROM rel_detpedido_inventario rdi;

    -- Traer data
    Select
       -- detalles pedido
    dtp.id_pro_pedido,
    dtp.cant_pedido,
    inv.pre_pro * dtp.cant_pedido TotalPagar,

      -- inventario
    inv.unidad_pro,
    inv.pre_pro,

      -- variables
    @val_pedido := dtp.cant_pedido * inv.pre_pro,
    @resta := inv.unidad_pro - dtp.cant_pedido,
    @producto_pedido := dtp.id_pro_pedido,
    
    -- pedido mas reciente
    @ultimo_pedido := dtp.cod_pedido


    From rel_detpedido_inventario rdi
    Join detalle_pedido dtp On dtp.cod_pedido = rdi.cod_pedido
    Join inventario inv On inv.cod_pro = rdi.cod_pro
    Where cod_detpedido_inv = @cod_detpedido_inv;
    
    Update inventario SET inventario.unidad_pro = @resta Where inventario.id_pro = @producto_pedido;
    Update detalle_pedido SET detalle_pedido.val_pedido = @val_pedido Where detalle_pedido.cod_pedido = @ultimo_pedido;
    
COMMIT;
END;


-- ********************** PROCESOS DE ALMACENADO DE ESTADISTICAS **********************
-- Proceso Insertar Estadistica
CREATE PROCEDURE Ins_Estadistica(
     IN PV_titulo_estadistica VarChar(255)
    ,IN PLT_desc_estadistica LongText
    ,IN PV_url_archivo VarChar(255)
    ,IN PEN_formato_estadistica Enum('doc', 'html', 'xlsx', 'txt', 'text', 'pdf', 'png', 'jpg', 'jpeg')
    ,IN PV_correo_electronico VarChar(255)
    ,IN PT_hora_generar_estadistica Time
    ,IN PEN_tipo_estadistica Enum('Generado', 'Guardado')
    ,IN PEN_ind_estadistica Enum('Enabled', 'Disabled')
    ,IN PEN_tiempo_generar_estadistica Enum('Diariamente', 'Semanalmente', 'Mensualmente', 'Anualmente')
    ,IN PBI_cod_usuario Int
)
BEGIN
  START TRANSACTION; 



-- ##############     TABLA    ESTADISTICAS    ##############
-- ######################################################
  INSERT INTO aguamanantialdb.estadisticas(
    titulo_estadistica
    ,desc_estadistica
    ,url_archivo
    ,formato_estadistica
    ,correo_electronico
    ,hora_generar_estadistica
    ,tipo_estadistica
    ,ind_estadistica
    ,tiempo_generar_estadistica
    ,cod_usuario
  ) VALUES (
     PV_titulo_estadistica
    ,PLT_desc_estadistica
    ,PV_url_archivo
    ,PEN_formato_estadistica
    ,PV_correo_electronico
    ,PT_hora_generar_estadistica
    ,PEN_tipo_estadistica
    ,PEN_ind_estadistica
    ,PEN_tiempo_generar_estadistica
    ,PBI_cod_usuario
  );
  SELECT @cod_estadistica := Max(cod_estadistica) FROM estadisticas;


  -- Insertar en la tabla Historial Estadistica
  INSERT INTO aguamanantialdb.historial_estadistica(
  ) VALUES (
  );
  SELECT @cod_hist_estadistica := Max(cod_hist_estadistica) FROM historial_estadistica;


  -- Insertar en la tabla Relacional Historial con Estadisticas
  INSERT INTO aguamanantialdb.rel_hist_estadistica(
   cod_historial_estadistica
  ,cod_estadistica
  ) VALUES (
    @cod_hist_estadistica,
    @cod_estadistica
  );
COMMIT;
END;








-- qwe