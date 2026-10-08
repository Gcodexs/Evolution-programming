namespace ApexTask_Desktop
{
    partial class Form1
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            panelPendientes = new FlowLayoutPanel();
            panelProgreso = new FlowLayoutPanel();
            panelTerminadas = new FlowLayoutPanel();
            label1 = new Label();
            label2 = new Label();
            label3 = new Label();
            label4 = new Label();
            btnNuevaTarea = new Button();
            panelPendientes.SuspendLayout();
            panelProgreso.SuspendLayout();
            panelTerminadas.SuspendLayout();
            SuspendLayout();
            // 
            // panelPendientes
            // 
            panelPendientes.Controls.Add(label1);
            panelPendientes.Controls.Add(btnNuevaTarea);
            panelPendientes.Location = new Point(32, 50);
            panelPendientes.Name = "panelPendientes";
            panelPendientes.Size = new Size(300, 500);
            panelPendientes.TabIndex = 0;
            panelPendientes.Paint += flowLayoutPanel1_Paint;
            // 
            // panelProgreso
            // 
            panelProgreso.Controls.Add(label2);
            panelProgreso.Location = new Point(338, 50);
            panelProgreso.Name = "panelProgreso";
            panelProgreso.Size = new Size(300, 500);
            panelProgreso.TabIndex = 1;
            // 
            // panelTerminadas
            // 
            panelTerminadas.Controls.Add(label3);
            panelTerminadas.Controls.Add(label4);
            panelTerminadas.Location = new Point(644, 50);
            panelTerminadas.Name = "panelTerminadas";
            panelTerminadas.Size = new Size(300, 500);
            panelTerminadas.TabIndex = 2;
            // 
            // label1
            // 
            label1.AutoSize = true;
            label1.Font = new Font("Microsoft Sans Serif", 12F);
            label1.Location = new Point(3, 0);
            label1.Name = "label1";
            label1.Size = new Size(100, 25);
            label1.TabIndex = 0;
            label1.Text = "PENDING";
            // 
            // label2
            // 
            label2.AutoSize = true;
            label2.Font = new Font("Microsoft Sans Serif", 12F);
            label2.Location = new Point(3, 0);
            label2.Name = "label2";
            label2.Size = new Size(147, 25);
            label2.TabIndex = 1;
            label2.Text = "IN PROGRESS";
            // 
            // label3
            // 
            label3.AutoSize = true;
            label3.Font = new Font("Microsoft Sans Serif", 12F);
            label3.Location = new Point(3, 0);
            label3.Name = "label3";
            label3.Size = new Size(137, 25);
            label3.TabIndex = 2;
            label3.Text = "COMPLETED";
            // 
            // label4
            // 
            label4.AutoSize = true;
            label4.Font = new Font("Microsoft Sans Serif", 12F);
            label4.Location = new Point(146, 0);
            label4.Name = "label4";
            label4.Size = new Size(76, 25);
            label4.TabIndex = 1;
            label4.Text = "FINISH";
            // 
            // btnNuevaTarea
            // 
            btnNuevaTarea.Font = new Font("Segoe UI", 11F, FontStyle.Bold, GraphicsUnit.Point, 0);
            btnNuevaTarea.Location = new Point(109, 3);
            btnNuevaTarea.Name = "btnNuevaTarea";
            btnNuevaTarea.Size = new Size(146, 37);
            btnNuevaTarea.TabIndex = 1;
            btnNuevaTarea.Text = "Nueva Tarea";
            btnNuevaTarea.UseVisualStyleBackColor = true;
            // 
            // Form1
            // 
            AutoScaleDimensions = new SizeF(8F, 20F);
            AutoScaleMode = AutoScaleMode.Font;
            AutoSize = true;
            ClientSize = new Size(1032, 603);
            Controls.Add(panelTerminadas);
            Controls.Add(panelProgreso);
            Controls.Add(panelPendientes);
            Name = "Form1";
            Text = "ApexTask - Gestor de Proyectos";
            panelPendientes.ResumeLayout(false);
            panelPendientes.PerformLayout();
            panelProgreso.ResumeLayout(false);
            panelProgreso.PerformLayout();
            panelTerminadas.ResumeLayout(false);
            panelTerminadas.PerformLayout();
            ResumeLayout(false);
        }

        #endregion

        private FlowLayoutPanel panelPendientes;
        private FlowLayoutPanel panelProgreso;
        private FlowLayoutPanel panelTerminadas;
        private Label label1;
        private Label label2;
        private Label label3;
        private Label label4;
        private Button btnNuevaTarea;
    }
}
