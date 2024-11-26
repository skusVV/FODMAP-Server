async function paginate(sql, query, table_name) {
  const currentPage = parseInt(query.page);
  const limit = parseInt(query.limit);

  const [{ count }] = await sql`
  SELECT COUNT(*)
  FROM ${sql(table_name)}`;

  const totalRecords = parseInt(count);
  const totalPages = Math.ceil(totalRecords / limit);

  return { totalRecords, totalPages, currentPage, limit };
}

export default paginate;
