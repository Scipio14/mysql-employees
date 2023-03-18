import { pool } from "../db.js";

export const getEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM employee");
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    const sql = "SELECT * FROM employee WHERE id = ?;";
    const [rows] = await pool.query(sql, [id]);
    if (rows.length <= 0) {
      return res.status(404).json({ message: "Employee NOT found" });
    }
    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const createEmployee = async (req, res) => {
  const { name, salary } = req.body;
  try {
    //  pool.query('INSERT INTO employees SET ?',[req.body]);PARA INSERTARLOS VALORES EN GRUPOS
    const [rows] = await pool.query(
      "INSERT INTO employee (name,salary) VALUES (?,?)",
      [name, salary]
    );
    return res.status(201).send({
      id: rows.insertId,
      name,
      salary,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM employee WHERE id = ?;", [
      req.params.id,
    ]);

    if (result.affectedRows <= 0) {
      return res.status(404).json({ message: "Employee NOT found" });
    } else {
      return res.sendStatus(204);
    }
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, salary } = req.body;
  try {
  /** Con el método PUT se actualizan todos los campos, por eso la query debe quedar de esta forma
   const [result] = await pool.query('UPDATE employee SET name = ?, salary = ? WHERE id = ?',[name,salary,id]);
 */
  /**Con el método PATCH sólo se actualizan los campos que quiero, por ello se deberá usar la siguiente consulta con el IFNULL, que lo que hace es que si yo le paso un valor nulo o undefined lo va a pasar con el valor que ya estaba */
  const [result] = await pool.query(
    "UPDATE employee SET name = IFNULL(?,name), salary = IFNULL(?,salary) WHERE id = ?",
    [name, salary, id]
  );
  if (result.affectedRows === 0)
    return res.status(404).json({
      message: "Employee NOT  found",
    });

  const [rows] = await pool.query("SELECT * FROM employee WHERE id = ?", [id]);

  return res.json(rows[0]);
    
  } catch (error) {
    return res.status(500).json({
      message:"Something went wrong"
    })
  }
};
