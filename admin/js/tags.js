<main class="content container-fluid p-4">

    <div class="d-flex justify-content-between align-items-center mb-4">

        <h2>TAGs</h2>

        <button id="btnNovaTag" class="btn btn-primary">

            <i class="bi bi-plus-circle"></i>

            Nova TAG

        </button>

    </div>

    <div class="card p-3">

        <div class="mb-3">

            <input

                id="pesquisa"

                class="form-control"

                placeholder="Pesquisar TAG...">

        </div>

        <div class="table-responsive">

            <table class="table table-hover align-middle">

                <thead>

                    <tr>

                        <th>ID</th>

                        <th>TOKEN</th>

                        <th>STATUS</th>

                        <th>PET</th>

                        <th width="220">AÇÕES</th>

                    </tr>

                </thead>

                <tbody id="listaTags">

                </tbody>

            </table>

        </div>

    </div>

</main>

<script src="js/config.js"></script>
<script src="js/api.js"></script>
<script src="js/tags.js"></script>
